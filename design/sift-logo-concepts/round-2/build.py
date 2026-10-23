from pathlib import Path
from math import sin, cos, radians
from html import escape
import re
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

ROOT = Path(__file__).resolve().parent
FONTS = {}

def font(family, **axes):
    key = family, tuple(axes.items())
    if key not in FONTS:
        f = TTFont(ROOT / 'fonts' / (family + '.ttf'))
        valid = {a.axisTag for a in f['fvar'].axes}
        FONTS[key] = instantiateVariableFont(f, {k:v for k,v in axes.items() if k in valid}, inplace=True)
    return FONTS[key]

def lettering(text, family='archivo', size=160, color='#153A45', tracking=-2, **axes):
    f = font(family, **axes)
    gs, cmap = f.getGlyphSet(), f.getBestCmap()
    scale = size/f['head'].unitsPerEm
    x = 0
    parts = []
    for ch in text:
        name = cmap[ord(ch)]
        pen = SVGPathPen(gs)
        gs[name].draw(TransformPen(pen, (scale,0,0,-scale,x,0)))
        parts.append(f'<path d="{pen.getCommands()}"/>')
        x += f['hmtx'][name][0]*scale+tracking
    return f'<g fill="{color}">{"".join(parts)}</g>', x-tracking

def fit_word(text, family, x, baseline, width, size=160, **kwargs):
    art,w = lettering(text,family,size,**kwargs)
    s=width/w
    return f'<g transform="translate({x} {baseline}) scale({s})">{art}</g>'

def svg(name, art, box='0 0 256 256'):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{box}" role="img" aria-label="Sift {name} logo concept"><title>Sift / {name}</title>{art}</svg>'

blue, orange, navy, paper = '#234BD7', '#F16A3D', '#142F3A', '#FFF7E7'

# A: three broad, fluid ribbons. Flat colour and deliberate open channels.
current = f'''<g fill="none" stroke-linecap="round">
 <path d="M48 83C75 39 135 36 180 61C213 80 215 112 187 128C161 143 123 121 96 130C65 140 61 164 85 180C116 202 165 192 195 168" stroke="{blue}" stroke-width="30"/>
 <path d="M49 121C71 102 94 100 122 108C150 116 176 113 185 98" stroke="{orange}" stroke-width="22"/>
 <path d="M58 185C89 218 151 225 196 197" stroke="{orange}" stroke-width="22"/>
 </g>'''

# B: an original asymmetric owl with one oversized reading lens.
scout = f'''<path fill="{navy}" d="M45 36L88 58C112 48 141 48 166 60L209 34L203 105C221 134 218 174 198 201L208 219L173 215C146 233 107 234 79 216L46 220L56 201C35 176 31 139 47 110Z"/>
 <path fill="{orange}" d="M62 69L86 82L64 99ZM190 68L168 83L192 99Z"/>
 <path fill="{paper}" d="M57 121C58 82 102 74 127 107C150 76 196 89 197 128C198 166 167 192 128 211C89 193 55 166 57 121Z"/>
 <path fill="{orange}" d="M69 158C83 178 102 191 128 204C153 192 173 178 187 159C169 166 149 167 128 159C108 168 88 167 69 158Z"/>
 <circle cx="91" cy="125" r="20" fill="{navy}"/><circle cx="160" cy="127" r="31" fill="{orange}"/>
 <circle cx="160" cy="127" r="23" fill="{paper}"/><circle cx="158" cy="126" r="12" fill="{navy}"/>
 <circle cx="95" cy="120" r="5" fill="{paper}"/><circle cx="162" cy="121" r="4" fill="{paper}"/>
 <path fill="{navy}" d="M116 143L128 156L140 143L128 137Z"/>
 <path fill="{orange}" d="M184 150L212 174L205 182L177 157Z"/>
 <path fill="{navy}" d="M115 177L128 184L141 177L128 193Z"/>
 <path fill="{paper}" d="M90 200L94 207L98 200L102 208L106 201L110 210L94 212ZM146 202L150 210L154 201L158 208L162 200L166 208L150 214Z"/>'''

# C: a typographic identity with a folded-page initial, rather than a safety badge.
forest, rust = '#24463D', '#B24B32'
initial,_=lettering('S','fraunces',size=174,color=forest,wght=620,opsz=72,SOFT=25,WONK=1)
folio=f'''<path fill="#F1E4CB" d="M58 32H164L202 70V224H58Z"/>
 <path fill="{rust}" d="M164 32V70H202Z"/>
 <path fill="none" stroke="{forest}" stroke-width="5" d="M146 32H58V224H202V88"/>
 <g transform="translate(77 183)">{initial}</g>
 <path fill="{rust}" d="M78 199H184V205H78Z"/>'''

# D: staggered, slightly rotated type; a contrasting i acts as the accent.
offbeat=''
for ch,x,y,angle in [('s',20,185,-5),('i',128,171,3),('f',178,181,-3),('t',282,190,6)]:
    letter,_=lettering(ch,'fredoka',size=190,color='#D75027' if ch=='i' else '#25201C',wght=700,wdth=110)
    offbeat+=f'<g transform="translate({x} {y}) rotate({angle})">{letter}</g>'
offbeat+='<path d="M329 39L341 25M346 57L364 52" fill="none" stroke="#D75027" stroke-width="9" stroke-linecap="round"/>'

# E: a detailed inspection seal. The eye and concentric engraving survive as
# a silhouette; the outer typography is intentionally for larger uses.
stamp = f'<g fill="none" stroke="{forest}"><circle cx="128" cy="128" r="113" stroke-width="4"/><circle cx="128" cy="128" r="104" stroke-width="1.7"/><circle cx="128" cy="128" r="81" stroke-width="2"/></g>'
for angle in range(0,360,15):
    a=radians(angle)
    x1,y1=128+85*cos(a),128+85*sin(a)
    x2,y2=128+91*cos(a),128+91*sin(a)
    stamp+=f'<path d="M{x1:.2f} {y1:.2f}L{x2:.2f} {y2:.2f}" stroke="{forest}" stroke-width="1.5"/>'
stamp+=f'<path d="M53 128Q128 48 203 128Q128 208 53 128Z" fill="{paper}" stroke="{forest}" stroke-width="4"/>'
stamp+=f'<circle cx="128" cy="128" r="35" fill="{forest}"/><circle cx="128" cy="128" r="22" fill="{rust}"/><circle cx="128" cy="128" r="12" fill="{forest}"/><circle cx="136" cy="118" r="5" fill="{paper}"/>'
for x in [73,81,89,97]:
    y=128-0.4*(x-65)
    stamp+=f'<path d="M{x} {y:.1f}L{x-5} {256-y:.1f}" stroke="{forest}" stroke-width="1.5"/>'
    stamp+=f'<path d="M{256-x} {y:.1f}L{261-x} {256-y:.1f}" stroke="{forest}" stroke-width="1.5"/>'
top,tw=lettering('SIFT','archivo',size=16,color=forest,tracking=3,wght=650)
stamp+=f'<g transform="translate({128-tw/2} 42)">{top}</g>'
bottom,bw=lettering('SEE THE SIGNS','archivo',size=11,color=forest,tracking=1.6,wght=650)
stamp+=f'<g transform="translate({128-bw/2} 224)">{bottom}</g>'
stamp+=f'<circle cx="27" cy="128" r="3" fill="{rust}"/><circle cx="229" cy="128" r="3" fill="{rust}"/>'

specs=[
 ('a-current','Current','COLORFUL / FLUID',current,'0 0 256 256','#F0F3FF',blue,'bricolagegrotesque',{'wght':750,'wdth':100,'opsz':96},'Flowing ribbons, electric blue, and warm orange.'),
 ('b-scout','Scout','PLAYFUL / CHARACTER',scout,'0 0 256 256','#FFF1DB',navy,'bricolagegrotesque',{'wght':720,'wdth':100,'opsz':72},'An observant owl with a reading lens and attitude.'),
 ('c-fieldnotes','Fieldnotes','EDITORIAL / CULTURED',folio,'0 0 256 256','#F4ECDC',forest,'fraunces',{'wght':620,'opsz':72,'SOFT':25,'WONK':1},'Expressive serif lettering and a folded-page signature.'),
 ('d-offbeat','Offbeat','BOLD / OUTSPOKEN',offbeat,'0 0 400 256','#FFDD69','#25201C','fredoka',{'wght':700,'wdth':110},'Chunky, staggered letters with a punch of orange.'),
 ('e-watchful','Watchful','DETAILED / CRAFTED',stamp,'0 0 256 256','#EBEFE6',forest,'fraunces',{'wght':620,'opsz':72,'SOFT':25,'WONK':1},'An engraved inspection seal with an eye for detail.'),
]

for key,name,style,body,box,bg,ink,family,axes,note in specs:
    (ROOT/(key+'.svg')).write_text(svg(name,body,box),encoding='utf-8')
    if key=='d-offbeat':
        lockup=body
        lb='0 0 400 256'
    else:
        lockup=body+fit_word('Sift',family,292,189,315,color=ink,**axes)
        lb='0 0 640 256'
    (ROOT/(key+'-lockup.svg')).write_text(svg(name,lockup,lb),encoding='utf-8')

# A custom concept board gives the five different personalities equal space.
cards=[]
for i,(key,name,style,body,box,bg,ink,family,axes,note) in enumerate(specs):
    x=44+(i%3)*552
    y=144+(i//3)*600
    symbol='<svg x="160" y="106" width="208" height="208" viewBox="'+box+'">'+body+'</svg>'
    lockup=(ROOT/(key+'-lockup.svg')).read_text(encoding='utf-8')
    start=lockup.index('>')+1
    lockbody=lockup[start:lockup.rindex('</svg>')]
    lb='0 0 400 256' if key=='d-offbeat' else '0 0 640 256'
    cards.append(f'''<g transform="translate({x} {y})">
      <rect width="528" height="572" rx="14" fill="{bg}"/>
      <text x="26" y="42" font-size="13" font-weight="650" letter-spacing="1.4" fill="{ink}">{style}</text>
      {symbol}
      <svg x="44" y="344" width="440" height="140" viewBox="{lb}">{lockbody}</svg>
      <path d="M26 490H502" stroke="{ink}" opacity=".18"/>
      <text x="26" y="525" fill="{ink}" font-size="23" font-weight="650">{chr(65+i)} / {name}</text>
      <text x="26" y="550" fill="{ink}" font-size="12.5">{escape(note)}</text>
    </g>''')

board=f'''<svg xmlns="http://www.w3.org/2000/svg" width="1744" height="1374" viewBox="0 0 1744 1374">
 <rect width="1744" height="1374" fill="#FCFAF6"/>
 <g font-family="Arial, sans-serif">
 <text x="44" y="65" font-size="42" font-weight="700" fill="{navy}">Sift, with personality.</text>
 <text x="44" y="105" font-size="20" fill="#5D6668">Five distinct directions. Different voices, different levels of detail.</text>
 {''.join(cards)}
 <g transform="translate(1185 830)" fill="{navy}">
 <text x="0" y="0" font-size="24" font-weight="700">Choose the personality.</text>
 <text x="0" y="48" font-size="17">A brings color and movement.</text>
 <text x="0" y="81" font-size="17">B brings a memorable character.</text>
 <text x="0" y="114" font-size="17">C brings editorial confidence.</text>
 <text x="0" y="147" font-size="17">D brings a louder, friendlier voice.</text>
 <text x="0" y="180" font-size="17">E brings intricate, crafted detail.</text>
 <text x="0" y="264" font-size="14" fill="#5D6668">Concepts only. The live app is unchanged.</text>
 </g></g></svg>'''
(ROOT/'concepts.svg').write_text(board,encoding='utf-8')

# Reduction studies, not a production asset kit. Dedicated one-ink drawings
# preserve intentional internal negative space rather than flattening all fills.
ink='#142F3A'
outer='M45 36L88 58C112 48 141 48 166 60L209 34L203 105C221 134 218 174 198 201L208 219L173 215C146 233 107 234 79 216L46 220L56 201C35 176 31 139 47 110Z'
face='M57 121C58 82 102 74 127 107C150 76 196 89 197 128C198 166 167 192 128 211C89 193 55 166 57 121Z'
scout_mono=f'<g fill="{ink}"><path fill-rule="evenodd" d="{outer}{face}"/><path fill-rule="evenodd" d="M111 125A20 20 0 1 0 71 125A20 20 0 1 0 111 125ZM99 120A5 5 0 1 0 89 120A5 5 0 1 0 99 120Z"/><path fill-rule="evenodd" d="M191 127A31 31 0 1 0 129 127A31 31 0 1 0 191 127ZM182 127A22 22 0 1 0 138 127A22 22 0 1 0 182 127Z"/><circle cx="158" cy="126" r="11"/><path d="M116 143L128 156L140 143L128 137ZM184 150L212 174L205 182L177 157Z"/></g>'
folio_mono=folio.replace('fill="#F1E4CB"','fill="none"')
stamp_mono=stamp.replace(f'fill="{paper}"','fill="none"')
stamp_mono=stamp_mono.replace(f'<circle cx="128" cy="128" r="35" fill="{forest}"/>',f'<circle cx="128" cy="128" r="35" fill="none" stroke="{forest}" stroke-width="3"/>')
stamp_mono=stamp_mono.replace(f'<circle cx="128" cy="128" r="22" fill="{rust}"/>',f'<circle cx="128" cy="128" r="22" fill="none" stroke="{forest}" stroke-width="2"/>')
proofs=[current,scout_mono,folio_mono,offbeat,stamp_mono]
proof_cards=[]
for i,(spec,art) in enumerate(zip(specs,proofs)):
    key,name,style,body,box,*_=spec
    art=re.sub(r'#[0-9A-Fa-f]{6}',ink,art)
    (ROOT/(key+'-mono-study.svg')).write_text(svg(name+' one-ink study',art,box),encoding='utf-8')
    x=30+i*268
    proof_cards.append(f'<text x="{x}" y="35" font-family="Arial" font-size="19" fill="{ink}">{chr(65+i)} / {name}</text><svg x="{x}" y="65" width="200" height="200" viewBox="{box}">{art}</svg><rect x="{x}" y="300" width="220" height="220" rx="12" fill="{ink}"/><svg x="{x+10}" y="310" width="200" height="200" viewBox="{box}">{art.replace(ink,"#FFFFFF")}</svg>')
proof=f'<svg xmlns="http://www.w3.org/2000/svg" width="1370" height="550"><rect width="1370" height="550" fill="#FCFAF6"/>{"".join(proof_cards)}</svg>'
(ROOT/'one-ink-studies.svg').write_text(proof,encoding='utf-8')
eye_small=f'<path d="M30 128Q128 27 226 128Q128 229 30 128Z" fill="none" stroke="{forest}" stroke-width="14"/><circle cx="128" cy="128" r="38" fill="{forest}"/>'
(ROOT/'e-watchful-reduction-study.svg').write_text(svg('Watchful reduction study',eye_small),encoding='utf-8')

