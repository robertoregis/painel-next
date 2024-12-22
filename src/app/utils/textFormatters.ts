export function name_formated(title:string) {
    let com_acento = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ";
    let sem_acento = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr";
    let novastr = "";
    for(let i=0; i < title.length; i++) {
        let troca=false;
        for (let a=0; a<com_acento.length; a++) {
            if (title.substr(i,1)==com_acento.substr(a,1)) {
                novastr+=sem_acento.substr(a,1);
                troca=true;
                break;
            }
        }
        if (troca==false) {
            novastr+=title.substr(i,1);
        }
    }
    let array = novastr.split(' ')
    let join = array.join('-')
    let name = join.toLowerCase()
    return name
}

export function textSlice(text: string, limit: number) {
    if(text) {
      if(text.length >= limit) {
        return text.slice(0, (limit -1)) + '...'
      } else {
        return text
      }
    } else {
      return text
    }
  }
  
  export function toCapitalize(word: string | any) {
    let wordFirst = word.slice(0, 1)
    let rest = word.slice(1)
    let nameCapitalize = wordFirst.toUpperCase() + rest
    let regexp = /[-,.]/gi
    let result = nameCapitalize.replace(regexp, " ")
    return result
  }
  
  export function stringFirstUpper(word: string) {
    // pegando a primeira letra
    let firstLetter = word.slice(0, 1).toUpperCase()
    let stringWithoutTheLastLetter = word.slice(1)
    let modifiedString = firstLetter + stringWithoutTheLastLetter
    return modifiedString
  }


  export const buildQueryString = (params: any) => {
    return new URLSearchParams(params).toString();
  };