using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace ManualBuilder {
    public class Builder {

        private string sourcePath;
        private string outPath;

        public Builder(string sourcePath, string outPath){
            this.sourcePath = sourcePath;
            this.outPath = outPath;
        }

        public void build() { 
            List<Chapter> col = new List<Chapter>();
            string[] f = this.getFiles();
            foreach (var file in f) {
                
                if (isNameValidFormat(file)) {
                    var c = new Chapter();
                    Console.WriteLine("=====================");
                    Console.WriteLine("Found file: " + file);
                    c.name = this.getFileName(file);
                    c.humanName = this.getFileHumanName(file);
                    c.index = this.getFileIndex(file);
                    Console.WriteLine(String.Format("Name and index identified: {0}, {1}, {2}", c.name,c.humanName,c.index));
                    Console.WriteLine("Reading file: " + file);
                    c.md = this.readFile(file);
                    Console.WriteLine("Parsing file: " + file);
                    c.html = this.getParsedMarkdown(c.md);
                    col.Add(c);
                    Console.WriteLine("Chapter Added: " + c.name);
                }
            }

            var json = @"var manualcontent = " + col.ToJSON();

            Console.WriteLine("=====================");
            Console.WriteLine("Writing to file");
            this.writeString(json);
            Console.WriteLine("Done.");
            Console.WriteLine("Press any key to quit.");
            Console.ReadLine();
        }

        public bool isNameValidFormat(string path) {
            bool valid = false;
            try {
                var filename = Path.GetFileName(path).Replace(".md", "");
                var validLength = filename.Split('_').Length == 2;
                var indexChar = filename.Split('_')[0];
                int index;
                bool isNum = Int32.TryParse(indexChar, out index);

                return validLength && isNum;

            } catch (Exception e) {
                //do nothing
            }

            return valid;
        }

        public int getFileIndex(string path) {
            int index = 0;
            try{
                var filename = Path.GetFileName(path).Replace(".md", "");
                var indexChar = filename.Split('_')[0];
                bool isNum = Int32.TryParse(indexChar, out index);
            }catch(Exception e){
                //do nothing
            }

            return index;
        }

        public string getFileName(string path) {
            var name = Path.GetFileName(path).Split('_')[1].Replace(".md", "");
            return name.ToLower();
        }

        public string getFileHumanName(string path) {
            var name = Path.GetFileName(path).Split('_')[1].Replace(".md", "");
            name = string.Concat(name.Select(x => Char.IsUpper(x) ? " " + x : x.ToString())).TrimStart(' ');
            return name;
        }

        public void writeString(string content) {
            using (StreamWriter outfile = new StreamWriter(this.outPath + @"\manual_content.js")) {
                outfile.Write(content);
            }
        }

        public string readFile(string path) {
            string text = System.IO.File.ReadAllText(path);
            return text;
        }

        public string[] getFiles(){
            string[] filePaths = Directory.GetFiles(this.sourcePath, "*.md", SearchOption.AllDirectories);
            return filePaths;
        }

        public string getParsedMarkdown(string markdownText){
            string html = "";

            try{
                WebRequest request = WebRequest.Create ("https://api.github.com/markdown/raw");
                request.Method = "POST";
                byte[] byteArray = Encoding.UTF8.GetBytes (markdownText);
                request.ContentType = "text/plain";
                request.ContentLength = byteArray.Length;
                Stream dataStream = request.GetRequestStream ();
                dataStream.Write (byteArray, 0, byteArray.Length);
                dataStream.Close ();
                WebResponse response = request.GetResponse ();
                //Console.WriteLine (((HttpWebResponse)response).StatusDescription);
                dataStream = response.GetResponseStream ();
                StreamReader reader = new StreamReader (dataStream);
                html = reader.ReadToEnd ();
                reader.Close ();
                dataStream.Close ();
                response.Close ();
            }catch(Exception e){
                Console.WriteLine("ERROR: " + e.ToString());
            }

            return html;
        }
    }
}
