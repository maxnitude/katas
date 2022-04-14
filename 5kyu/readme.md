const fruits = new Dictionary(['cherry', 'pineapple', 'melon', 'strawberry', 'raspberry']);

fruits.findMostSimilar('strawbery'); // must return "strawberry"
fruits.findMostSimilar('berry'); // must return "cherry"

const things = new Dictionary(['stars', 'mars', 'wars', 'codec', 'codewars']);

things.findMostSimilar('coddwars'); // must return "codewars"

const languages = new Dictionary(['javascript', 'java', 'ruby', 'php', 'python', 'coffeescript']);

languages.findMostSimilar('heaven'); // must return "java"

languages.findMostSimilar('javascript'); // must return "javascript" (same words are obviously the most similar ones)
