---
layout: post
title: Switching between Scrivener and Bibdesk
---

For the past 8 years or so, I've used
[LaTeX](http://en.wikipedia.org/wiki/LaTeX) almost exclusively to write
my (academic) papers. Once it is up and running it takes care of the
nitty gritty of formatting and referencing, meaning you can focus more
on the writing. For several of those 8 years I've been on a mac, and
finding the combination of
[TeXShop](http://pages.uoregon.edu/koch/texshop/) and
[BibDesk](http://bibdesk.sourceforge.net/) pretty darn awesome. BibDesk
is a reference manager for the Mac that stores its database in BibTeX
format (a standard bibliographical format used by LaTeX). TeXShop is an
editing program built for editing LaTeX files; these are plain text and
could be edited in any old text editor, but TeXShop provides nice LaTeX
syntax highlighting and a fairly useful macro system (and is less busy
than other editors I've looked at).

\

Having said that, TeXShop is pretty ugly to work in sometimes when there
are lots of comments and insertions around and things start to get
messy. So recently I've been using
[Scrivener](http://www.literatureandlatte.com/scrivener.php) to write my
papers and similar documents. Scrivener is basically a lovely looking
writing environment that let's you make comments separate from the doc
(a la Word), and has some nifty features for managing project-related
files and snippets (great for collecting random thoughts you want to put
in a paper *somewhere* at a later date...but not just now!). It doesn't
do LaTeX natively, but I've got a pretty smooth system converting to
LaTeX via
[multimarkdown](http://fletcherpenney.net/multimarkdown/) (more on that
another time). One thing I miss about TeXShop is the ability to quickly
search for BibDesk references inside the editor. We can't do this (at
least while it isn't scriptable), but the next best thing is to set up
some shortcuts to switch between the apps. My setup is as follows:

\

\* In Scrivener, I have BibDesk set as my bibliography manager (under
Preferences \> General). This does little more than switch to BibDesk
when I press command-Y.

\

\* I have a little applescript in BibDesk that it is triggered by the
same command-Y key combination. It will take the references currently
highlighted in BibDesk and copy them to Scrivener. The applescript is as
follows:

> **tell** *application* "System Events" **to** **keystroke** "c" using
> {command down}\
> **tell** *application* "Scrivener"\
> **activate****tell** *application* "System Events" **to**
> **keystroke** "v" using {command down}\
> **end** **tell**

\* All this will do is copy whatever BibDesk usually copies into
Scrivener. We want to copy the references over in multimarkdown's
referencing format, and can do this using templates in BibDesk; see
 [here](http://groups.google.com/group/multimarkdown/browse_thread/thread/0c9937c17906a8b1/6f633137107832fa?#6f633137107832fa)
for a discussion and examples. Mine looks like this:\

> [\#\<\$publications.citeKey.@componentsJoinedByComma/\>][]

So when I press command-Y in BibDesk (having selected a few references)
I get something like [\#Estes55;][] back in the Scrivener doc. It's a
bit slow and clunky but does the job. Also, I'm not really an
Applescript programmer, so there may be a more sensible way to do this.\
 \
