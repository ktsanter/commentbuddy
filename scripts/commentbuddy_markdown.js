function formatTextFromMarkup(text, forBlackBoard) {
	var codeblockspan = "<span style="
	codeblockspan += "\"font-family: 'courier new', courier; ";
	if (forBlackBoard) {
		codeblockspan += "line-height: 0.6; ";
	}
	codeblockspan += "background: #F1F1F1;";
	codeblockspan += "border: 1px solid #E1E1E1;";
    codeblockspan += "border-radius: 4px;";
    codeblockspan += "display:inline-block;";
	codeblockspan += "\">";
	var codeblockendspan = '</span>';
	var highlightspan = "<span style=\"background-color: #FFFF00\">";
	var hightlightendspan = '</span>';
	var lineBreak = "|";
	
	var reader = new commonmark.Parser();
	var writer = new commonmark.HtmlRenderer();
	//console.log('format: original text: |' + text + '|');
	text = text.replaceAll(lineBreak, "\n");
	//console.log('pre-processed: |' + text + '|');
	var parsed = reader.parse(text);

	var result = writer.render(parsed);
	result = emojifyString(result, forBlackBoard);
	result = result.replaceAll('<code>', codeblockspan);
	result = result.replaceAll('<code class="language-function">', codeblockspan);
	result = result.replaceAll('</code>', codeblockendspan);

	//result = emojifyString(result, forBlackBoard);
	result = extraMarkdownReplaceAll(result, /\~\~[^~]*\~\~/g, '<s>', '</s>'); 
	result = extraMarkdownReplaceAll(result, /\%\%[^%]*\%\%/g, highlightspan, hightlightendspan); 
	//console.log('formatted comment = |' + result + '|');

	return result;
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function extraMarkdownReplaceAll(originalString, pattern, opentoken, closetoken)
{
	var s = originalString;
	var result;
	
	while ( (result = pattern.exec(s)) !== null) {
		s = s.substring(0, result.index) + opentoken + result.toString().slice(2, -2) + closetoken + s.substring(pattern.lastIndex);
	}

	return s;
}
