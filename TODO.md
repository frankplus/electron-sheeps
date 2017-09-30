A subtitle is a data structure composed of two datatypes:
- Dialog: String representing the text of the subtitle
- Range: An interval of time in which the subtitle is to be shown on screen

We need a structure to represent a set of subtitles.
Its capabilities must be:
- The subtitles must be ordered
- Get n-th subtitle
- Get the index for a given subtitle (In the sense that you need to know what's the index of every subtitle)
- Insert subtitle
- Remove subtitle
- Update a subtitle (Dialog and or Range)

Also we need possibly another structure (or the same as before) that answers to this query:
- Get all subtitles whose range overlaps a given interval of time




Possible npm packages to represent the list of subtitles:
- splaylist (https://www.npmjs.com/package/splaylist)
- node-interval-tree (https://www.npmjs.com/package/node-interval-tree)
