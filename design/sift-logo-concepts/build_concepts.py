"""Original, monochrome vector concepts for Sift. No font dependencies."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent
INK = "#111111"

S = "M102 64C90 51 72 44 54 44C22 44 2 62 2 88C2 111 17 123 46 132L66 138C81 142 88 149 88 160C88 174 76 182 56 182C34 182 18 174 6 160L-10 180C6 198 28 208 56 208C90 208 114 190 114 160C114 136 98 122 70 114L50 108C34 103 28 97 28 88C28 76 38 68 54 68C70 68 82 74 92 83Z"

def wordmark(joined=False):
    crossbar = 'M196 100H340V124H196Z' if joined else 'M196 100H270V124H196ZM282 100H340V124H282Z'
    return f'''<g fill="{INK}">
      <path transform="translate(12 0)" d="{S}"/>
      <path d="M160 100H184V208H160Z"/>
      <circle cx="172" cy="67" r="13"/>
      <path d="M218 208V88C218 60 234 44 260 44H278V68H264C250 68 242 76 242 90V208Z"/>
      <path d="M300 68H324V170C324 180 329 184 340 184H350V208H336C312 208 300 196 300 174Z"/>
      <path d="{crossbar}"/>
    </g>'''

def svg(name, body, box='0 0 256 256'):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{box}" role="img" aria-label="Sift {name} concept"><title>Sift / {name}</title>{body}</svg>\n'

split_top = '<path d="M208 40H104C64 40 40 64 40 104C40 138 64 156 104 156H120L160 116H104C88 116 80 112 80 100C80 88 88 80 104 80H208Z"/>'
marks = {
    'a-split': ('Split', f'<g fill="{INK}">{split_top}<g transform="rotate(180 128 128)">{split_top}</g></g>'),
    'b-through': ('Through', f'<g fill="{INK}"><path d="M40 48H112V80H40ZM144 48H216V80H144ZM64 112H112V144H64ZM144 112H192V144H144Z"/><circle cx="128" cy="192" r="20"/></g>'),
    'c-minnow': ('Minnow', f'<path fill="{INK}" fill-rule="evenodd" d="M32 128C67 66 130 66 174 105L224 72V184L174 151C130 190 67 190 32 128ZM112 128A14 14 0 1 0 84 128A14 14 0 1 0 112 128Z"/>'),
    'd-ligature': ('Ligature', wordmark(True)),
    'e-step': ('Step', f'<path fill="{INK}" d="M208 40H80L40 80V104L168 177.9H40V216H176L216 176V153.9L88 80H208Z"/>'),
}

for key, (name, body) in marks.items():
    box = '0 0 352 256' if key == 'd-ligature' else '0 0 256 256'
    (ROOT / f'{key}.svg').write_text(svg(name, body, box), encoding='utf-8')
    if key != 'd-ligature':
        lockup = body + f'<g transform="translate(280 0)">{wordmark()}</g>'
        (ROOT / f'{key}-lockup.svg').write_text(svg(name, lockup, '0 0 656 256'), encoding='utf-8')

