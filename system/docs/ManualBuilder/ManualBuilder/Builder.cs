using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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
                    c.md = this.readFile(file);
                    c.name = this.getFileHumanName(file);
                    c.index = this.getFileIndex(file);
                    col.Add(c);
                }
            }

            var json = @"var manualcontent = " + col.ToJSON();
            this.writeString(json);
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
    }
}
