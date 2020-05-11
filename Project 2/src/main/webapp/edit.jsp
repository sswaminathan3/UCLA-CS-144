<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %><!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Edit Post</title>
    <link href="edit.css" rel="stylesheet" type="text/css">
</head>
<body>
    <!-- Side navigation -->
    <div class="sidenav">
        <h1>${param.username}'s blog</h1>
    </div>
    <div class="main">
        <div><h1>Edit Post</h1></div>
        <form action="post" method="POST">
            <div>
                <button class="button" type="submit" name="action" value="save">Save</button>
                <button class="button" type="submit" name="action" value="close">Close</button>
                <button class="button" type="submit" name="action" value="preview" formmethod="GET">Preview</button>
                <button class="button" type="submit" name="action" value="delete">Delete</button>
            </div>
            <input type="hidden" name="username" value="${param.username}">
            <input type="hidden" name="postid" value=${param.postid}> 
            <div>
                <label for="title"><h3>Title</h3></label>
                <input style="width: 50rem;" type="text" id="title" name="title" value='<c:out value="${title}"/>'>
            </div>
            <div>
                <label for="body"><h3>Body</h3></label>
                <textarea style="height: 20rem;width: 50rem;" id="body" name="body">${body}</textarea>
            </div>
        </form>
    </div>
</body>
</html>
