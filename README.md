#pixel
=====
##What is this?

pixel is a node.js pixel tracking server.  It (will generate unique) pixels and collect information on view times and whatnot.

In `/p/whatever.gif` anything will return a 1x1 gif at this point and the tracking info will be console logged from the event handler.  Might as well make it event based in case users want to incorporate push based services.

##API

So far, api is limited.  I'm working on sqlite implementation to get it off the ground, then probably oauth.  
To note, I'm a new javascript programmer also.  I don't expect you to use this thing in production, please.
