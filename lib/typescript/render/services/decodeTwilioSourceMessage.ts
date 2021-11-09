export const decodeTwilioSourceMessage = (messageContent: string, contentStart: string, contentEnd: string) => {
  const enCodedMessageStartIndex = messageContent.search(contentStart);
  const enCodedMessageStartLength = contentStart.length - 1;

  const enCodedMessageEndIndex = messageContent.search(contentEnd);

  const enCodedMessage = messageContent.substring(
    enCodedMessageStartIndex + enCodedMessageStartLength,
    enCodedMessageEndIndex
  );
  const formattedEnCodedMessage = enCodedMessage.split('+').join(' ');
  const decodedMessage = decodeURIComponent(formattedEnCodedMessage);

  return decodedMessage;
};
