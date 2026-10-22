"""Build reviewed, bilingual A4 CVs from the portfolio's current HTML.
Requires Python 3 and reportlab. Run from any working directory.
"""
from pathlib import Path
from html.parser import HTMLParser
from html import escape
import json, re
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak, KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parents[1]
class Node:
    def __init__(self, tag='', attrs=()): self.tag=tag; self.attrs=dict(attrs); self.children=[]
    def all(self, predicate):
        result=[]
        for child in self.children:
            if isinstance(child, Node):
                if predicate(child): result.append(child)
                result.extend(child.all(predicate))
        return result
    def content(self, language):
        key=self.attrs.get('data-key')
        if language=='en' and key in TRANSLATIONS: return TRANSLATIONS[key]
        return re.sub(r'\s+', ' ', ''.join(c.content(language) if isinstance(c,Node) else c for c in self.children)).strip()
    def cls(self, name): return name in self.attrs.get('class','').split()
class Parser(HTMLParser):
    def __init__(self): super().__init__(); self.root=Node(); self.stack=[self.root]
    def handle_starttag(self,tag,attrs):
        n=Node(tag,attrs); self.stack[-1].children.append(n)
        if tag not in {'img','link','meta','br','hr','input','source'}: self.stack.append(n)
    def handle_endtag(self,tag):
        if len(self.stack)>1 and self.stack[-1].tag==tag:self.stack.pop()
    def handle_data(self,data): self.stack[-1].children.append(data)
TRANSLATIONS=json.loads((ROOT/'scripts/traduccion.js').read_text().split('=',1)[1].strip().rstrip(';'))['en']
parser=Parser(); parser.feed((ROOT/'index.html').read_text()); root=parser.root
fontdir=Path('/usr/share/fonts/truetype/dejavu')
if fontdir.exists():
    pdfmetrics.registerFont(TTFont('CV',str(fontdir/'DejaVuSans.ttf')))
    pdfmetrics.registerFont(TTFont('CV-Bold',str(fontdir/'DejaVuSans-Bold.ttf')))
    pdfmetrics.registerFontFamily('CV',normal='CV',bold='CV-Bold')
    FONT,BOLD='CV','CV-Bold'
else: FONT,BOLD='Helvetica','Helvetica-Bold'
INK=colors.HexColor('#202731'); MUTED=colors.HexColor('#505b68'); BLUE=colors.HexColor('#245c8f')
styles={
 'body':ParagraphStyle('body',fontName=FONT,fontSize=9.4,leading=14,textColor=INK,spaceAfter=5),
 'small':ParagraphStyle('small',fontName=FONT,fontSize=8,leading=11.5,textColor=MUTED,spaceAfter=4),
 'title':ParagraphStyle('title',fontName=BOLD,fontSize=25,leading=30,textColor=INK,spaceAfter=8),
 'role':ParagraphStyle('role',fontName=FONT,fontSize=10.5,leading=15,textColor=BLUE),
 'section':ParagraphStyle('section',fontName=BOLD,fontSize=10.5,leading=15,textColor=BLUE,spaceBefore=15,spaceAfter=9,keepWithNext=True),
 'item':ParagraphStyle('item',fontName=BOLD,fontSize=9.7,leading=14,textColor=INK,spaceAfter=3),
}
def para(text,style='body'):return Paragraph(escape(text),styles[style])
def byid(id):return root.all(lambda n:n.attrs.get('id')==id)[0]
def key(k,lang):return root.all(lambda n:n.attrs.get('data-key')==k)[0].content(lang)
def first(node, pred, lang):
    found=node.all(pred);return found[0].content(lang) if found else ''
def header(lang,second=False):
    role=key('hero_role',lang)
    if second:
        return [para('Iván Matus Angulo','title'),para('Proyectos y competencias' if lang=='es' else 'Projects and skills','role'),Spacer(1,8)]
    photo=Image(str(ROOT/'gato.png'),width=66,height=66,kind='proportional')
    table=Table([[[para('Iván Matus Angulo','title'),para(role,'role')],photo]],colWidths=[425,70])
    table.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),10)]))
    return [table,para('Puyehue, Entre Lagos, Chile · ivanmatus204@gmail.com · +56 9 9945 5574','small'),para('GitHub: github.com/MaThUZiB','small')]
def foot(c,doc):
    c.setStrokeColor(colors.HexColor('#d9dee4'));c.line(48,42,A4[0]-48,42)
    c.setFont(FONT,8);c.setFillColor(MUTED);c.drawString(48,28,'Iván Matus Angulo · ivanmatus204@gmail.com');c.drawRightString(A4[0]-48,28,f'{doc.page} / 2')
for lang in ['es','en']:
    out=ROOT/'assets/cv'/f'Ivan_Matus_CV_{lang}.pdf';out.parent.mkdir(parents=True,exist_ok=True)
    story=header(lang)
    story += [para('Perfil profesional' if lang=='es' else 'Professional profile','section'),para(key('about_short',lang)),para(key('about_focus',lang))]
    for id,label in [('experiencia','Experiencia profesional' if lang=='es' else 'Professional experience'),('educacion','Formación académica' if lang=='es' else 'Education')]:
        story.append(para(label,'section'))
        for card in byid(id).all(lambda n:n.cls('timeline-card')):
            title=first(card,lambda n:n.tag=='h4',lang);date=first(card,lambda n:n.cls('fecha'),lang)
            if id=='educacion' and '2026' in date: title+=' (en curso)' if lang=='es' else ' (in progress)'
            parts=[para(title,'item'),para(first(card,lambda n:n.cls('empresa'),lang)+' | '+date,'small')]
            desc=first(card,lambda n:n.tag=='p',lang)
            if desc:parts.append(para(desc))
            parts.append(Spacer(1,5));story.append(KeepTogether(parts))
    story.append(PageBreak());story+=header(lang,True)
    story.append(para('Proyectos destacados' if lang=='es' else 'Featured projects','section'))
    for card in root.all(lambda n:n.cls('proyecto-card')):
        story.append(KeepTogether([para(first(card,lambda n:n.cls('titulo-proyecto'),lang),'item'),para(first(card,lambda n:n.tag=='p',lang)),para(first(card,lambda n:n.cls('tech-mini'),lang),'small'),Spacer(1,7)]))
    story.append(para('Tecnologías principales' if lang=='es' else 'Core technologies','section'))
    for cat in root.all(lambda n:n.cls('categoria')):
        story.append(para(first(cat,lambda n:n.tag=='h4',lang)+': '+', '.join(n.content(lang) for n in cat.all(lambda n:n.tag=='li'))))
    story.append(para('Certificaciones e idiomas' if lang=='es' else 'Credentials and languages','section'))
    for card in root.all(lambda n:n.cls('cert-card')):
        title=first(card,lambda n:n.cls('title'),lang);issuer=first(card,lambda n:n.cls('subtitle'),lang)
        story.append(para(title+' - '+issuer,'small'))
    story.append(para('Español nativo · Inglés C1' if lang=='es' else 'Native Spanish · English C1','small'))
    doc=SimpleDocTemplate(str(out),pagesize=A4,rightMargin=48,leftMargin=48,topMargin=42,bottomMargin=56,title='Iván Matus Angulo - CV',author='Iván Matus Angulo')
    doc.build(story,onFirstPage=foot,onLaterPages=foot)
    print(out)
