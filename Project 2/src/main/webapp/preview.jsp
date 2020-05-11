<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %><!DOCTYPE html><!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Preview Post</title>
    <link href="preview.css" rel="stylesheet" type="text/css">
</head>
<body>
    <!-- Side navigation -->
    <div class="sidenav">
        <h1>${param.username}'s blog</h1>
            <form action="post" method="GET">
                <input type="hidden" name="username" value="${param.username}">
                <input type="hidden" name="postid" value="${param.postid}">
                <input type="hidden" name="title" value='<c:out value="${param.title}"/>'>
                <input type="hidden" name="body" value='<c:out value="${param.body}"/>'>
                <button class="button" type="submit" name="action" value="open">Close Preview</button>
            </form>
    </div>
        <div class = "main">
            <div id="title"><h1>${markTitle}</h1></div>
            <div id="body"><h3>${markBody}<h3></div>
        </div>
    </body>
</html>