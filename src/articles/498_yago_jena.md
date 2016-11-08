## How to load Yago into Apache Jena / Fuseki
November 11, 2016

This article describes how to load the [Yago](http://yago-knowledge.org) Linked Data knowledge collection into an [Apache Jena](https://jena.apache.org/) triple store database on Windows 10 as well as on Linux.

1. At very first, please make sure you have Java 8 Runtime Environment installed on your system.

2. Download all Yago graphs you need from the [downloads section](http://www.mpi-inf.mpg.de/departments/databases-and-information-systems/research/yago-naga/yago/downloads/) as .ttl files. In my case I took all graphs from _TAXONOMY_, _CORE_ and additonally the _yagoDBpediaInstances_ and _yagoDBpediaClasses_ collections to have relations from Yago entities to DBpedia ones. Download the files to a folder on your system, let's say `/home/ferdinand/yago/` on Linux or `C:\Users\Ferdinand\yago` on Windows and extract them using 7zip.

3. Delete all `.7z` files.

4. Download `apache-jena-3.1.1.zip` (or newer version) and `apache-jena-fuseki-2.4.1.zip` from [here](https://jena.apache.org/download/index.cgi) and extract them to, let's say `/home/ferdinand/jena/` and `/home/ferdinand/fuseki/` (or the analogue directories on Windows).

5. Now the .ttl files needs to get some kind of preprocessed, where non-unicode characters are replaced in order for Jena to accept the data. On Linux run `sed -i 's/|/-/g' ./* && sed -i 's/\\\\/-/g' ./* && sed -i 's/–/-/g' ./*` from within the directory where your .ttl files are. On Windows, start the Ubuntu Bash, navigate to the respective directory (e.g. `/mnt/c/Users/Ferdinand/yago`) and do the same command. It will take several minutes. I mean, really several...

6. Create a folder to be used for the database later, e.g. `/home/ferdinand/yago/data`.

7. Add the Fuseki root directory (e.g. `/home/ferdinand/fuseki`) and the Jena _bin_ (or _bat_ on Win) (e.g. `/home/ferdinand/jena/bin`) to your `PATH` environment variable. On Linux you would do this by editing your `~/.bash_profile`, on Windows you can search for _"envionment variables"_ and then use the Windows system settings dialog.

7. Load the graphs using _tdbloader_: `tdbloader.bat --loc data ./*` from the directory where your .ttl files are located. This may take several hours. Not joking...

8. Start Fuseki typing `java -jar fuseki-server.jar --update --loc /home/ferdinand/yago/data /myGraph` to run fuseki with your entire Yago graph available under the _myGraph_ alias.

9. Open [http://localhost:3030](http://localhost:3030) in your browser and start making queries.

If you're about to run really expensive queries, consider the following.

1. Set the `JVM_ARGS` environment variable to `-Xms512m -Xmx2048M -XX:-UseGCOverheadLimit -XX:+UseParallelGC`. This will basically prevent you from getting _OutOfMemory_ errors.

2. Use _tdbquery_ since it might be a little more performant than the web SPARQL endpoint. An example _tdbquery_ command might look like this, assuming you have a file `q.txt` that contains your SPARQL query: `tdbquery --loc=/home/ferdinand/yago/data --time --results=CSV --query=q.txt > output.txt`
