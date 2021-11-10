export const decodeURIComponentMessage = (messageContent: string, contentStart: string, contentEnd: string) => {
  const enCodedMessageStartIndex = messageContent.search(contentStart);
  const enCodedMessageStartLength = contentStart.length;

  const enCodedMessageEndIndex = messageContent.search(contentEnd);

  const enCodedMessage = messageContent.substring(
    enCodedMessageStartIndex + enCodedMessageStartLength,
    enCodedMessageEndIndex
  );
  const formattedEnCodedMessage = enCodedMessage.split('+').join(' ');
  const decodedMessage = decodeURIComponent(formattedEnCodedMessage);
  const errorMessage = 'Unsupported message type';

  return decodedMessage !== '' ? decodedMessage : errorMessage;
};
