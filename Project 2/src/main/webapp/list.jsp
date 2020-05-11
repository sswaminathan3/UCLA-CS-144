<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %><!DOCTYPE html>
<%@ page import="com.mysql.*" %>
<%@ page import="java.sql.*" %>
<html>
<head>
    <meta charset="UTF-8">
    <title>Post List</title>
    <link href="list.css" rel="stylesheet" type="text/css">
</head>
<body>
    <!-- Side navigation -->
    <div class="sidenav">
        <h1>${param.username}'s blog</h1>
        <form action="post" id="0">
            <button class="newbutton" type="submit" name="action" value="open">New Post</button>
            <input type="hidden" name="username" value="${param.username}">
            <input type="hidden" name="postid" value="0">
        </form>
    </div>
    <div class="main">
    <table>  
        <% 
            Connection c = null;
            ResultSet rs = null;

            try {
                Class.forName("com.mysql.jdbc.Driver");

                c = DriverManager.getConnection("jdbc:mysql://localhost:3306/CS144", "cs144", "");

                String statement = "select * from Posts where username='" + request.getParameter("username") + "' order by postid";

                PreparedStatement ps = c.prepareStatement(statement);

                rs = ps.executeQuery();

                while (rs.next()) {
                %>
                <tr>
                    <%
                        String title = rs.getString("title");
                        String created = rs.getString("created");
                        String modified = rs.getString("modified");
                        String username = rs.getString("username");
                        int postid = rs.getInt("postid");
                        String body = rs.getString("body");
                    %> 
                    <h1><%=title %></h1>
                    <h3>Created: <%=created %></h3>
                    <h3>Modified: <%=modified %></h3>
                    <form id="0" action="post" method="GET">
                        <button class="open" type="submit" name="action" value="open">Open</button> 
                        <input type="hidden" name="username" value=<%= username %>>
                        <input type="hidden" name="postid" value=<%= postid %>>
                        <input type="hidden" name="title" value='<c:out value="<%= title %>"/>'>
                        <input type="hidden" name="body" value='<c:out value="<%= body %>"/>'>
                    </form>
                    <form id="0" action="post" method="POST">
                        <button class="delete" type="submit" name="action" value="delete">Delete</button>
                        <input type="hidden" name="username" value=<%= username %>>
                        <input type="hidden" name="postid" value=<%= postid %>>
                        <input type="hidden" name="title" value='<c:out value="<%= title %>"/>'>
                        <input type="hidden" name="body" value='<c:out value="<%= body %>"/>'>
                    </form>      
                </tr>  
                <%         
                    }
                } catch (SQLException ex) {
                    System.out.println("SQLException caught");
                    System.out.println("---");
                    while ( ex != null ) {
                        System.out.println("Message   : " + ex.getMessage());
                        System.out.println("SQLState  : " + ex.getSQLState());
                        System.out.println("ErrorCode : " + ex.getErrorCode());
                        System.out.println("---");
                        ex = ex.getNextException();
                    }
                } finally {
                    try { c.close(); } catch (Exception e) { /* ignored */ }
                }
            %>
    </table>
</div>
</body>
</html>