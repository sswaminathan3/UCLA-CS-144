#!/bin/bash
mysql CS144 < create.sql
gradle assemble
cp build/libs/editor.war $CATALINA_BASE/webapps
sudo tail -f $CATALINA_BASE/logs/catalina.out
