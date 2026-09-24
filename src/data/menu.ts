import type { Category, CategoryId, OptionGroup, Product, ProductVariant } from '../types';
import { formatCurrency } from '../lib/currency';
import { demoCoupon } from './demoCoupons';

const fallback = '/media/atmosfera-lunare.jpg';
const images = ['/media/hot-dourado.jpg','/media/combinado-caixas.jpg','/media/hossomaki-detalhe.jpg','/media/hot-roll.jpg','/media/niguiri-especial.jpg','/media/sashimi-flor.jpg','/media/embalagem-lunare.jpg'];
export const categories: Category[] = [
  ['entradas','Entradas','Pequenos começos, muito detalhe.',images[0]],['combinados','Combinados','Seleções para compartilhar.',images[1]],
  ['hossomaki','Hossomaki','Clássicos de arroz e alga.',images[2]],['uramaki','Uramaki','Criações de textura delicada.',images[1]],
  ['hot-roll','Hot Roll','Crocância e contraste.',images[3]],['jyo','Jyo','Peças envolvidas em salmão.',images[4]],
  ['sashimi','Sashimi','Cortes em apresentação essencial.',images[5]],['niguiri','Niguiri','Arroz e cobertura em equilíbrio.',images[4]],
  ['temaki','Temaki','Cones preparados no momento.',images[6]],['bebidas','Bebidas','Acompanhamentos para a experiência.',fallback],
].map(([id,name,description,image])=>({id:id as CategoryId,slug:id,name,description,image,alt:`Categoria ${name}`}));

const pieces=(small:number,large:number):ProductVariant[]=>[
  {id:`${small}-pecas`,name:`${small} peças`,priceCents:small*900,available:true},
  {id:`${large}-pecas`,name:`${large} peças`,priceCents:large*850,available:true},
];
const finishGroup:OptionGroup={id:'finalizacao',name:'Finalização',required:true,min:1,max:1,options:[{id:'classica',name:'Clássica',priceCents:0,available:true},{id:'macaricada',name:'Maçaricada',priceCents:400,available:true}]};
const extrasGroup:OptionGroup={id:'extras',name:'Adicionais demonstrativos',required:false,min:0,max:2,options:[{id:'cream-cheese',name:'Cream cheese',priceCents:300,available:true},{id:'cebolinha',name:'Cebolinha extra',priceCents:150,available:true},{id:'tare',name:'Molho tare',priceCents:100,available:true}]};
type Seed=[string,string,string,number,CategoryId,string,boolean?,boolean?,string[]?,ProductVariant[]?,OptionGroup[]?];
const seeds:Seed[]=[
  ['sashimi-lemon','Sashimi Lemon','Cortes de salmão com finalização cítrica.',5400,'entradas',images[5],true,true,['cítrico','salmão']],
  ['ceviche-salmao','Ceviche de salmão','Salmão em cubos e toque cítrico.',4800,'entradas',images[5],true,true,['cítrico','salmão']],
  ['sunomono','Sunomono','Pepino, gergelim e molho agridoce.',2200,'entradas',images[2],false,true,['leve']],
  ['saturno-60','Saturno · 60 peças','Seleção ampla de peças da casa.',21000,'combinados',images[1],true,true,['para compartilhar']],
  ['mercurio-jv-16','Mercúrio JV · 16 peças','Seleção compacta em dezesseis peças.',8000,'combinados',images[6],true,true,['combinado']],
  ['urano-10','Urano · 10 peças','Seleção autoral em dez peças.',3900,'combinados',images[1],false,true,['combinado']],
  ['sol-20','Sol · 20 peças','Combinado de vinte peças variadas.',9999,'combinados',images[1],true,true,['combinado']],
  ['jupiter-28','Júpiter · 28 peças','Seleção de vinte e oito peças.',11000,'combinados',images[1],false,true,['para compartilhar']],
  ['marte-24','Marte · 24 peças','Seleção de vinte e quatro peças.',7800,'combinados',images[6],false,true,['combinado']],
  ['hosso-philadelphia','Hossomaki Philadelphia','Salmão e cream cheese em corte clássico.',2700,'hossomaki',images[2],false,true,['salmão'],pieces(4,8),[extrasGroup]],
  ['hosso-grelhado','Hossomaki Grelhado','Salmão grelhado e acabamento delicado.',2900,'hossomaki',images[2],false,true,['grelhado'],pieces(4,8),[extrasGroup]],
  ['hosso-tartare-lemon','Hossomaki Tartare Lemon','Tartare de salmão com nota cítrica.',3200,'hossomaki',images[2],true,true,['cítrico'],pieces(4,8),[finishGroup,extrasGroup]],
  ['uramaki-philadelphia','Uramaki Philadelphia','Salmão, arroz, gergelim e cream cheese.',3200,'uramaki',images[1],false,true,['salmão'],pieces(4,8),[extrasGroup]],
  ['uramaki-grelhado','Uramaki Grelhado','Salmão grelhado e molho da casa.',3400,'uramaki',images[1],false,true,['grelhado'],pieces(4,8),[extrasGroup]],
  ['uramaki-tartare','Uramaki Tartare','Cobertura de tartare e ervas frescas.',3800,'uramaki',images[1],true,true,['tartare'],pieces(4,8),[finishGroup,extrasGroup]],
  ['uramaki-premium','Uramaki Premium','Composição autoral de salmão.',4200,'uramaki',images[4],true,true,['premium'],pieces(4,8),[finishGroup]],
  ['uramaki-especial','Uramaki Especial','Seleção de sabores da casa.',4000,'uramaki',images[4],false,false,['indisponível'],pieces(4,8),[]],
  ['hot-philadelphia','Hot Roll Philadelphia','Crocante com salmão e cream cheese.',3600,'hot-roll',images[3],true,true,['crocante'],pieces(4,8),[extrasGroup]],
  ['hot-grelhado','Hot Roll Grelhado','Recheio grelhado e finalização com tare.',3800,'hot-roll',images[0],false,true,['grelhado'],pieces(4,8),[extrasGroup]],
  ['hot-biquinho','Hot Roll Biquinho','Crocante com toque agridoce.',3900,'hot-roll',images[3],false,true,['crocante'],pieces(4,8),[finishGroup]],
  ['hot-especial','Hot Roll Especial','Criação quente com acabamento da casa.',4200,'hot-roll',images[0],true,true,['especial'],pieces(4,8),[finishGroup,extrasGroup]],
  ['jyo-philadelphia','Jyo Philadelphia','Salmão envolvendo arroz e cream cheese.',3600,'jyo',images[4],false,true,['salmão'],pieces(3,6),[extrasGroup]],
  ['jyo-macaricado','Jyo Maçaricado','Salmão maçaricado e molho da casa.',4000,'jyo',images[4],true,true,['maçaricado'],pieces(3,6),[extrasGroup]],
  ['jyo-lemon','Jyo Lemon','Jyo com acabamento cítrico.',3900,'jyo',images[4],false,true,['cítrico'],pieces(3,6),[finishGroup]],
  ['sashimi-salmao','Sashimi Salmão','Cortes selecionados de salmão.',5200,'sashimi',images[5],true,true,['salmão'],pieces(5,10),[]],
  ['sashimi-macaricado','Sashimi Maçaricado','Cortes levemente maçaricados.',5600,'sashimi',images[5],false,true,['maçaricado'],pieces(5,10),[extrasGroup]],
  ['sashimi-tartare','Tartare de Salmão','Salmão em cubos com acabamento da casa.',4900,'sashimi',images[5],false,true,['tartare']],
  ['niguiri-salmao','Niguiri Salmão','Arroz e lâmina de salmão.',3400,'niguiri',images[4],false,true,['salmão'],pieces(4,8),[]],
  ['niguiri-macaricado','Niguiri Maçaricado','Salmão maçaricado sobre arroz.',3800,'niguiri',images[4],true,true,['maçaricado'],pieces(4,8),[extrasGroup]],
  ['niguiri-especial','Niguiri Especial','Finalização autoral e molho da casa.',4200,'niguiri',images[4],false,true,['especial'],pieces(4,8),[finishGroup]],
  ['temaki-philadelphia','Temaki Philadelphia','Salmão, arroz, cebolinha e cream cheese.',3200,'temaki',images[6],true,true,['salmão'],[],[extrasGroup]],
  ['temaki-grelhado','Temaki Grelhado','Salmão grelhado e molho da casa.',3400,'temaki',images[6],false,true,['grelhado'],[],[extrasGroup]],
  ['temaki-tartare','Temaki Tartare','Tartare de salmão e toque cítrico.',3600,'temaki',images[6],false,true,['tartare'],[],[finishGroup]],
  ['agua','Água mineral','Com ou sem gás — opção a validar.',600,'bebidas',fallback,false,true,['bebida']],
  ['refrigerante','Refrigerante lata','Sabores e disponibilidade a validar.',800,'bebidas',fallback,false,true,['bebida']],
  ['cha-gelado','Chá gelado','Sabor demonstrativo, sem alegação nutricional.',1000,'bebidas',fallback,false,true,['bebida']],
];
export const products:Product[]=seeds.map(([id,name,description,priceCents,categoryId,image,featured=false,available=true,tags=[],variants=[],optionGroups=[]])=>({id,slug:id,name,description,priceCents,categoryId,image,alt:`${name} — apresentação ilustrativa do cardápio Lunare`,featured,available,tags,allergenNotes:'Informações de alergênicos pendentes de validação com o estabelecimento.',needsOwnerValidation:true,variants,optionGroups}));
export { demoCoupon, formatCurrency };
export const findProduct=(id:string)=>products.find((product)=>product.id===id);
export const findCategory=(id:CategoryId)=>categories.find((category)=>category.id===id);
export const fallbackImage=fallback;
