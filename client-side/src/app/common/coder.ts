
const keyWords = ["var", "let", "number", "string", "const"];
const symbo = [";", ""];
const operators = ["+", "-", "=", "*", "/"];
const char = ["\n"];

const stringPattren = new RegExp(/\'.*\'|\".\"/gm);
const keywordsPattrenAll = new RegExp(
  /const+|var+|let+|return+|await+|break+|case+|catch+|class+|continue+|default+|delete+|do+|else+|enum+|export+|extends+|finally+|for+|founction+|implements+|import+|in+|instanceof+|interface+|new+|package+|private+|protected+|public+|super+|switch+|static+|this+|throw+|try+|typeeof+|void+|while+|whit+|yleid/gm
);
const keywordsPattren = new RegExp(
  /const+|var+|let+|return+|await+|break+|case+|catch+|class+|continue+|default+|delete+|do+|else+|enum+|export+|extends+|finally+|for+|founction+|implements+|import+|in+|instanceof+|interface+|new+|package+|private+|protected+|public+|super+|switch+|static+|this+|throw+|try+|typeeof+|void+|while+|whit+|yleid/m
);
const keywordsPattren2 = new RegExp(
  /true+|false+|null+|debugger+|undefined+/g
)
const numbesPattern = new RegExp(/[0-9]+/g);
const operatorsPattren = new RegExp(/[\/*\-+=%&\|?><!]+/g)
const inputPattren = new RegExp(/\{\{\w*\}\}/g);
const funcationPattren = new RegExp(/\w*\(/gm)


function convertPattren(text: string, pattern:RegExp, className: string, tag = 'span'){
  const match  = text.match(pattern) || [];
  const replaceTo: string[] = [];
  let counter = 0
  while(match.length> 0) {
    const word = match[0];
    text = text.replace(word+'', `REPLACE${counter++}`);
    if(tag != 'input')
    replaceTo.push(`<${tag} CLASS="${className}">${word}</${tag}>`)
    else
    replaceTo.push(`<${tag} CLASS="${className}" id="${word}"/>`)
    match.splice(0,1);
  }
  for(let i = 0; i< replaceTo.length;i++) {
    text = text.replace('REPLACE'+i, replaceTo[i])
  }
  return text
}

export function converter(text: string, eKey: string){
  text = convertPattren(text, operatorsPattren, 'symbo');
  text = convertPattren(text, funcationPattren, 'funciton');
  text = convertPattren(text, keywordsPattrenAll, 'keyword');
  text = convertPattren(text, stringPattren, 'string');
  text = convertPattren(text, inputPattren, 'input '+eKey, 'input');
 return `<div class="code_editor">
  <pre>
  <code>

  ${text}
  </code>
  </pre>
  <div id="run" class="${eKey}"></div>
  </div>`;
}

