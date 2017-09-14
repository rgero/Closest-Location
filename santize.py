from creds import *
import re, argparse

if __name__=="__main__":
  targetKey = creds["api_key"]
  print(targetKey)
  parser = argparse.ArgumentParser(description="Sanitizes/Restores the API Key")
  parser.add_argument("fileName", metavar="f", help="the file to sanitize")
  parser.add_argument("--restore","-r", help="restores the API key", nargs="?", const=True)
  parser.add_argument("--sanitize","-s", help="removes the API Key", nargs="?", const=True)
  args = parser.parse_args()
  data = ""
  try:
    file = open(args.fileName,'r')
    data = file.read()
    file.close()
    if args.restore:
      data = re.sub("{{{API_KEY}}}", targetKey, data)
    if args.sanitize:
      data = re.sub(targetKey, "{{{API_KEY}}}", data)
    file = open(args.fileName, 'w')
    file.write(data)
    file.close()
  except:
    print("Error reading file")
  