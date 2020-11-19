# E.g. ApplicationCommunicationMessages -> application-communication-messages
def pascal_to_kebab(input):
    kebab_cased = ""

    for idx in range(len(input)):
        letter = input[idx]

        if idx == 0:
            kebab_cased += letter.lower()
        elif letter.isupper():
            kebab_cased += "-" + letter.lower()
        else:
            kebab_cased += letter.lower()

    return kebab_cased

def file_to_kebab(filepath):
    filename = filepath.split("/")[-1].split(".")[0]

    return pascal_to_kebab(filename)
