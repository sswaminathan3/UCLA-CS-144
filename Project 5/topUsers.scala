val lines = sc.textFile("twitter.edges") 
val words = lines.flatMap(line => line.split("[ ,]"))
val word1s = words.map(word => (word, 1))
val wordCounts = word1s.reduceByKey((a,b) => a+b)
val filteredWordCounts = wordCounts.filter( {case (x,y)=> y > 1000})
filteredWordCounts.saveAsTextFile("output")
System.exit(0)
