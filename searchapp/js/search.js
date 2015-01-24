/*
database Search engine and autocomplete
using trie and underscore
by mobin
25.dec.2014
*/


var targetList;
var s,ul;
/** token values */
var tok;
/** last token values. this will be used to determine which value changed in search input*/
  var lastTok=[];
/** indicator of changed value */
  var lastChanged;
    /** change value of search input based on selected term in suggestion list */
function updateSearchInp(text)
{
//  var tok=s.value.split(" ");
  /** changed tokenized values and clear the buffer */
  tok[lastChanged]=text;
  s.value=((tok).join().replace(/,/g," "));
  s.value+=" ";
  ul.style.display="none";
  tokenizeFindChanges();
  suftrie();
  s.focus();
  while(ul.firstChild) ul.removeChild(ul.firstChild);
};
/** create suggestion list based on possible values list */
  function CreateList(list){
    ul.style.display="block";
      while(ul.firstChild) ul.removeChild(ul.firstChild);
    var k,y,t;
    var num;
    var max=5;
    (list.length>=max)?num=max:num=list.length;
    for(k=0;k<num;k++)
    {
      y = document.createElement("LI");
      t = document.createTextNode(list[k]);
      y.appendChild(t);
      y.setAttribute("id",list[k]);
      y.setAttribute("onclick","updateSearchInp(this.id);");
      ul.appendChild(y);
    }
  }
//  var tempD=trieData;
  var unionIDx=[],tempIDx=[];
  var trie=JsSuffixTrie.fromJSON(trieTree);
/** find the node in trie based on requested value
tempD will be the node;
*/
  function wordToIndx(word)
  {
    var j;
    var tempD;
    var wordUnionIdx=[];
    if(word){
      var SimilarWords=trie.find(word);
      SimilarWords.forEach(function(entry,i){
        tempD = trieData;
        for(j=0;j<entry.length;j++)
        {
          if(tempD[entry[j]]==null)break;
            tempD=tempD[entry[j]];
        }
        if(tempD["idx"]!=null)
          wordUnionIdx=_.union(wordUnionIdx,tempD["idx"]);
        if(i>6)return;
      });
    }
    return wordUnionIdx;
  }
var possibleValues;
function suggestion(){
   /** create suggested list if there's any */
    try
    {
        if(tok[lastChanged].length>1)
          possibleValues = trie.find(tok[lastChanged]);
      else
        possibleValues = null;
    }
    catch(err) {
      //console.log(err);
      possibleValues=null;
    }
  ul.style.display="none";

    if(possibleValues!=null)
    {
      suftrie();
      if(possibleValues.length>1 || possibleValues[0]!=tok[lastChanged])
      {
        CreateList(possibleValues);
          possibleValues=null;
      }
    }
}
  function suftrie()
{
  unionIDx=[];
   if(!tok[lastChanged])return;
    tempIDx[lastChanged]=wordToIndx(tok[lastChanged]);
    /** add found indexes to index array */

    var j;
    /** desired values are in intersection of found indexes*/
    var t,temp=tempIDx[0];
    for(j=1;j<tempIDx.length;j++)
    {
          t =  _.intersection(tempIDx[j],temp);
//      if(t.length>0)
        temp=t;
//      else
//        break;
    }
    /** index list of possible results */
    unionIDx=temp;
  console.log(unionIDx);
  resultToShow();
    showList();
  }
function tokenizeFindChanges()
{
  /** tokenize words from input */
    tok=s.value.split(" ");
    while(tok.indexOf("")!=-1)tok.splice(tok.indexOf(""),1);
    tempIDx.length=tok.length;

    /** determine the changed term in token array */
    for(lastChanged=0;lastChanged<tok.length;lastChanged++)
    {
      if(lastTok[lastChanged]!=tok[lastChanged])
      {
        break;
      }
      if(lastChanged==tok.length-1)break;
    }
  /** update array */
    lastTok=tok;
  console.log(tok);
}
function search()
  {
    if(s.value[s.value.length-1]==" ")
    {
      ul.style.display="none";
      return;
    }
    if(s.value.length==0)
    {
      tokenizeFindChanges();
      suftrie();
      resultToShow();
    showList();
      return;
    }
    tokenizeFindChanges();
    suggestion();
    NotFound();
  }

String.prototype.toUnicode = function(){
    var result = "";
    for(var i = 0; i < this.length; i++){
        result += "\\u" + ("000" + this[i].charCodeAt(0).toString(16)).substr(-4);
    }
    return result;
};
//http://jsfiddle.net/FutureWebDev/HfS7e/
function highlightSearch(words,target) {
  var targetText=target.innerHTML;
  try{var text=words.join().replace(/,/g,"|");}
  catch(e)
  {
    var text=words;
  }
  var query = new RegExp("(" + text + ")", "gim");
  var e = eval("'" +targetText.toUnicode()+ "'");
  var enew = e.replace(/(<span>|<\/span>)/igm, "");
  var newe = enew.replace(query, "<span class=\"found\">$1</span>");
  targetText = newe;
  target.innerHTML=newe;
}
//http://stackoverflow.com/questions/26054691/find-all-numbers-in-document-and-style-them
function convertCodeToLink(targetElem)
{
  var patt1 =/\d{6}/g;
  var inx= -1;
  var text=targetElem.innerHTML;
  var found =(text.match(patt1));
    if(found)
  found.forEach(function findh(entry){
    var i=codeindex[entry];
      text=text.replace(entry, '<a href=\"#\" onclick=\"fillDetails('+i+')\">$&</a>');
  });
  targetElem.innerHTML=text;
}
function resultToShow()
{
  var res =[];
  if(unionIDx && unionIDx.length>0)
  {
    unionIDx.forEach(function(entry){
        res.push(entry);
    });
  }
  else
  {
    if(!notFoundFlag && s.value.length==0)
    for(g=codeindex[200005];g<=codeindex[990470];g++)
    {
      res.push(g);
    }
  }
  return (res);
}
function CreateDataItem(index)
{
  var yo,to;
  yo = document.createElement("LI");
  to = document.createTextNode(data[index].value);
  yo.appendChild(to);
  to = document.createElement("BR");
    yo.appendChild(to);
  to = document.createTextNode(data[index].label);
  yo.appendChild(to);
  //////////
  if(data[index].Comment.length>2){
    to = document.createElement("BR");
    yo.appendChild(to);
    to = document.createElement("SPAN");
    to.appendChild(document.createTextNode(data[index].Comment));
//    to.setAttribute("style","align:right;font-style:italic;color:#4a4a4a");
    yo.appendChild(to);
  }

  //////////


  yo.classList.add("list__item");
  try{
    if(tok.length>0)
    highlightSearch(tok,yo);
  }catch(e)
  {
//    console.log(e);
    highlightSearch("sorry",yo);
  }
  yo.setAttribute("id", index);
  yo.setAttribute("onclick","crDiag(this.id);");
  return yo;
}
var indexesToShow = [];
var topShowedItemIndex;
var maxResult = 20;
function createResultList()
{
  indexesToShow=resultToShow();
  topShowedItemIndex=0;
  var list = document.createElement("UL");
  var num;
  for(j=0;j<indexesToShow.length;j++)
  {
    list.appendChild(CreateDataItem(indexesToShow[j]));
    if(j>maxResult)break;
  }
  return list;
}
var notFoundFlag=false;
function NotFound()
{
  if(unionIDx && unionIDx.length>0)
  {
    s.style.backgroundColor="#fff";
    notFoundFlag= false;
  }
  else{
    s.style.backgroundColor="#f79797";
    notFoundFlag= true;
  }
}
