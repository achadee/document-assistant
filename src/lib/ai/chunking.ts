  /**
   * the chunk size could potentially be a dynamic variable
   * based on the size of the document, and the number of
   * documents that are being processed
   * 
   * I played around with the chunk size and overlap to find
   * the best values for the embeddings of the specific document
   * provided
   * 
   * Chunk size also has limitations based on the model being used
   * 
   * Preformance considerations:
   * - The chunk size should be large enough to provide meaningful
   *   embeddings
   * - The chunk size should be small enough to not exceed the 
   *   maximum input size of the model
   * - The chunk overlap should be large enough to provide context
   *   for the embeddings
   * - The chunk overlap should be small enough to not duplicate
   *   context in the embeddings
   */

type Header = {
  content: string;
  style: "number" | "empty" | "legal"
}

const getHeaderStyle = (line: string) => {
  // match legal style 1.1 ... 1.2 ... 1.3
  const legalStyle = /^\d+\.\d+/;
  if (legalStyle.test(line)) {
    return "legal";
  }

  // match number style 1. 2. 3.
  const numberStyle = /^\d+\./;
  if (numberStyle.test(line)) {
    return "number";
  }

  return "empty";
}

// Assuming headers are lines followed by newlines and contain uppercase letters
const getHeader = (headerStack: Header[], currentLine: string) : { isChild: boolean, headerStack: Header[] } => {
  const style = getHeaderStyle(currentLine)

  // find the style in the header stack
  const index = headerStack.findIndex(header => header.style === style);

  // if the style is not in the header stack
  if (index === -1) {
    headerStack.push({
      content: currentLine,
      style
    });
    
    return { isChild: true, headerStack };
  }

  // if the style is in the header stack remove all headers after the style
  headerStack.splice(index);

  // add the current header to the stack
  headerStack.push({
    content: currentLine,
    style
  });

  return { isChild: false, headerStack };
};

function parseDocument(
  lines: string[],
): string[] {
  let currentBody = '';
  const modifiedLines = [];
  let headerStack : Header[] = [];

  for (let currentIndex = 0; currentIndex < lines.length; currentIndex++) {
    const currentLine = lines[currentIndex];
    const lineContext = [
      lines[currentIndex - 2] || '',
      lines[currentIndex - 1] || '',
      lines[currentIndex],
      lines[currentIndex + 1] || '',
      lines[currentIndex + 2] || ''
    ].join('\n');

    const headerRegex = /(\n\n)([^\n]{1,100})(\n\n)/;

    if (headerRegex.test(lineContext)) {

      const { headerStack: newHeaderStack } = getHeader(headerStack, currentLine)

      // reassign the header stack
      headerStack = newHeaderStack;
      modifiedLines.push(`<header>${headerStack.map((h) => h.content).join(', ')}</header>`);


    } else {
      modifiedLines.push(currentLine);
      currentBody += ` ${currentLine}`;
    }
  }

  return modifiedLines;
}


export const generateChunks = (input: string): string[] => {

  // replace all white space between new lines
  input = input.replace(/\n\s*\n/g, '\n\n');

  // ensure that there are no more than two new lines between paragraphs
  input = input.replace(/\n{3,}/g, '\n\n');

  const modifiedLines = parseDocument(
    input.split('\n'),
  );

  const body = modifiedLines.join('\n').replace(/<\/header>/g, '');

  const chunks = body.split('<header>').filter((chunk) => chunk.length > 0);

  return chunks
};
