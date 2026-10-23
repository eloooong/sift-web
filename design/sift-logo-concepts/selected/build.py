"""Generate the approved owl assets from the selected original concept."""
from pathlib import Path
import xml.etree.ElementTree as ET

HERE = Path(__file__).resolve().parent
PROJECT = HERE.parents[2]
SOURCE = HERE.parent / 'round-2' / 'b-scout.svg'
VIEWBOX = '20 24 216 216'
PAINTS = {
    '#142F3A': 'foreground',
    '#F16A3D': 'muted-foreground',
    '#FFF7E7': 'background',
}
LIGHT = {'foreground':'#0f172a', 'muted-foreground':'#64748b', 'background':'#f8fafc', 'secondary':'#f1f5f9'}
DARK = {'foreground':'#fafafa', 'muted-foreground':'#a3a3a3', 'background':'#0a0a0a', 'secondary':'#262626'}

shapes=[]
for element in ET.parse(SOURCE).getroot():
    tag=element.tag.split('}')[-1]
    if tag=='title':
        continue
    attrs=dict(element.attrib)
    attrs['fill']=PAINTS[attrs['fill']]
    # A restrained second light tone retains the owl's feathered collar.
    if attrs.get('d','').startswith('M69 158'):
        attrs['fill']='secondary'
    shapes.append((tag,attrs))

def draw(items,palette=None,react=False):
    result=[]
    for tag,attrs in items:
        converted=dict(attrs)
        token=converted['fill']
        converted['fill']=palette[token] if palette else f'var(--{token})'
        result.append('      <'+tag+' '+' '.join(f'{key}="{value}"' for key,value in converted.items())+' />')
    return '\n'.join(result)

def asset(name,body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VIEWBOX}" role="img" aria-label="{name}"><title>{name}</title>\n{body}\n</svg>\n'

public=PROJECT/'public'/'brand'
public.mkdir(parents=True,exist_ok=True)
(public/'sift-owl.svg').write_text(asset('Sift owl logo',draw(shapes,LIGHT)),encoding='utf-8')
(public/'sift-owl-dark.svg').write_text(asset('Sift owl logo for dark backgrounds',draw(shapes,DARK)),encoding='utf-8')

component='''import { cn } from "@/lib/utils";

// Generated from the approved Scout artwork; see design/sift-logo-concepts/selected/build.py.
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="20 24 216 216"
      aria-hidden="true"
      focusable="false"
      className={cn("size-8 shrink-0", className)}
    >
'''+draw(shapes)+'''
    </svg>
  );
}
'''
(PROJECT/'src'/'components'/'layout'/'brand-mark.tsx').write_text(component,encoding='utf-8')

# The small mark retains the silhouette, facial disc, beak and lens; feather
# highlights and eye glints are omitted and the lens ring is thickened.
small=[]
for tag,attrs in shapes:
    if attrs.get('d','').startswith(('M90 200','M69 158','M62 69','M115 177')):
        continue
    if tag=='circle' and attrs.get('r') in ['4','5']:
        continue
    if tag=='circle' and attrs.get('r')=='23':
        attrs={**attrs,'r':'19'}
    small.append((tag,attrs))
(public/'sift-owl-small.svg').write_text(asset('Sift owl small icon',draw(small,LIGHT)),encoding='utf-8')
style='''<style>
  :root { --foreground: #0f172a; --muted-foreground: #64748b; --background: #f8fafc; --secondary: #f1f5f9; }
  @media (prefers-color-scheme: dark) {
    :root { --foreground: #fafafa; --muted-foreground: #a3a3a3; --background: #0a0a0a; --secondary: #262626; }
  }
</style>'''
(PROJECT/'src'/'app'/'icon.svg').write_text(asset('Sift owl icon',style+'\n'+draw(small)),encoding='utf-8')

# A transparent one-ink variant uses real negative space from the reduction study.
mono=(HERE.parent/'round-2'/'b-scout-mono-study.svg').read_text(encoding='utf-8')
mono=mono.replace('viewBox="0 0 256 256"',f'viewBox="{VIEWBOX}"').replace('#142F3A','#0f172a')
(public/'sift-owl-mono.svg').write_text(mono,encoding='utf-8')
(public/'sift-owl-white.svg').write_text(mono.replace('#0f172a','#ffffff'),encoding='utf-8')

# Review the chosen palette at real small sizes, on light and dark surfaces.
cards=[]
for i,(bg,palette,label) in enumerate([('#f8fafc',LIGHT,'Website / light'),('#0a0a0a',DARK,'Website / dark')]):
    x=i*600
    cards.append(f'<rect x="{x}" width="600" height="420" fill="{bg}"/><text x="{x+32}" y="42" font-family="Arial" font-size="18" fill="{palette["foreground"]}">{label}</text>')
    for size,offset in [(192,44),(48,288),(32,384),(16,470)]:
        body=draw(small if size==16 else shapes,palette)
        cards.append(f'<svg x="{x+offset}" y="100" width="{size}" height="{size}" viewBox="{VIEWBOX}">{body}</svg><text x="{x+offset}" y="350" font-family="Arial" font-size="15" fill="{palette["foreground"]}">{size}px</text>')
review=f'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="420">{"".join(cards)}</svg>'
(HERE/'palette-review.svg').write_text(review,encoding='utf-8')
