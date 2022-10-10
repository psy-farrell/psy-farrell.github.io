---
title: Getting stuff into Editorial
date: 2013-10-09
---

[Editorial](http://omz-software.com/editorial/) is the new text editor on the block that has all the kids talking. Its two main features that set it apart from the other N markdown editors available on the iPad are a) Inline preview of markdown, in a very pretty format, and b) the thing is fully Python scriptable. A [compendium of workflows](http://editorial-app.appspot.com/) shows all the cool stuff you can do with built in workflow components and Python scripting.

One issue with apps like this is getting docs in there in the first place. Many apps, Editorial included, can access a Dropbox account, and will by default set up their own directory in /Apps/. So one has a choice of manually moving documents to and from that directory, or making one's entire working directory available to the app. This latter is overkill, so I was looking for an easy way to get stuff into and out of Editorial. The solution is to stick the following bash code into an automator service. When run on a file, it will move that file into the Editorial Dropbox directory, and create a placeholder file with extension "edi" in it's place. Running the script on the ".edi" file will move the document back to its home (and delete the edi placeholder).

```
xpath=${1%/*} 
xbase=${1##*/}
xfext=${xbase##*.}
xpref=${xbase%.*}

editorialDir="/Your/Editorial/Dropbox/Directory"

if [ "$xfext" == "edi" ]
then
    echo "here!"
    targName=`less $1`
    mv $editorialDir/$targName $xpath
    rm $1
else
    if [  -a $editorialDir/$xbase ]
    then
        COUNTER=2
        while [  -a $editorialDir/$xpref$COUNTER.$xfext ]; do
            let COUNTER=COUNTER+1
        done
        targName=$xbase$COUNTER.$xfext
    fi
    mv $1 $editorialDir/$targName
    echo "$xpref$COUNTER.$xfext" > $xpath/$xpref.edi
fi
```