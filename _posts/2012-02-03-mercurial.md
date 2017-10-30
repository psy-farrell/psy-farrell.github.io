---
title: Mercurial, Dropbox for geeks
date: 2012-02-03
---

I'll admit it, [Dropbox](http://www.dropbox.com/) is pretty cool. It's
great for quickly sharing photos and docs with others (including
collaborators), and for a while I was using it to keep much of my
working directory in sync across computers. What's especially cool is
the rat pack add-on, which keeps track of all your file changes so you
can revert to an old version if you do something stupid (and boy, can I
do some stupid things).\
 \
 However, last year there were a few privacy issues raised with Dropbox.
The first is that there is no client-side encryption. That means that
although your data is encrypted on their servers, this can be decrypted
by them also. Their policy is not to do that, but they \*can\* be forced
to "[when legally required to do
so](https://www.dropbox.com/dmca#security)". Then there are fond
memories of the time that [every single account was left accessible
without a
password](http://www.boingboing.net/2011/06/20/dropbox-accounts-lef.html)
for a good few hours. Ouch!\
 \
 Even though the work I've been sharing on Dropbox isn't super-sensitive
(just working papers, data analyses and modelling), this isn't really
reassuring. One solution is to use services like
[SecretSync](http://getsecretsync.com/). However, this requires forking
over money for a pretty basic service that Dropbox should be providing
by default. So instead I've turned to a geeky option called
[Mercurial](http://mercurial.selenic.com/). I've actually been using
this for a few years to keep stuff in sync with [Steve
Lewandowsky](http://www.cogsciwa.com/) when we were writing our
[masterpiece](http://www.sagepub.com/books/Book233316), and it works
really well.\
 \
 Mercurial is technically known as a [distributed version control
system](http://en.wikipedia.org/wiki/Distributed_revision_control). We
start off with a seed repository, which contains the initial state of
all our files (if any), and initialize it. Then every user of the
repository can clone that repository to their own computer so they have
local copies of the files. One important thing is that the files in our
directory are kept separate from the repository itself. Accordingly,
working practice is to edit as per usual, and then every now and then to
"commit" those changes to the repository (e.g., at the end of the day,
or when you've reached a milestone). However, even after committing
those changes, they'll still just be local to your computer.
Accordingly, one needs to push their changes to the central repository
(which is usually hosted on a server, and talked to via ssh or the like)
and pull changes that other users might have made.\
 \
 One nice thing is the merge feature. If I've made changes to a file,
and you've made changes to the same file in the interim, then mercurial
can automatically merge those changes in an intelligent fashion. In
cases where changes can't be merged (i.e., we modified the same line in
the file), we can use a program like
[kdiff3](http://kdiff3.sourgeforge.net/) to manually resolve the
conflicts; in my experience this happens pretty rarely. Another cool
thing is that we also have a record of all changes we've made to all
files in the repository since the intialization. This has been a
lifesaver in cases where, for example, some model simulations have been
working really well, but then in overexuberant exploration I've made
some silly edits and lost the working version of the model (yes, I can
be that silly sometimes).\
 \
 By default, committing, pulling and pushing all need to be carried out
manually. However, I've been using an extension called
[autosync](http://mercurial.selenic.com/wiki/AutoSyncExtension) that
will automatically go through a commit/pull/merge/push cycle regularly.
Mine fires off every 10 minutes, so my computers are more or less in
constant sync. This avoids one problem with Dropbox, which is that it
eagerly syncs across all the crappy auxiliary files that are generated
when compiling LaTeX documents. I've got my Mac set up to delete all the
auxiliary files after completion, so this mostly prevents this
happening. Deleting those auxiliary files does mean each compilation
takes longer, but hey, compiling is just really fast these days.\
 \
 So Dropbox, you've a great service, but I think we should just keep it
casual.
