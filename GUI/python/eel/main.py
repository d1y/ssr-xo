import eel

eel.init('web')

@eel.expose
def say_hello_py(x):
  print('Hello from %s' % x)

@eel.expose
def loadPackage():
  file = "/Users/kozo4/cat/Project/ssr-xo/package.json"
  data = open(file, 'r').read()
  return data

say_hello_py('Python World!')
eel.say_hello_js('Python World!')
eel.say_hello_js('chenhonzhou')

# https://stackoverflow.com/questions/55394203/unable-to-use-both-size-of-the-window-and-application-options-together-with-eel
eel.start(
  'main.html',
  # size(700, 400)
)