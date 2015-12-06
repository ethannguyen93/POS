Set objWord = CreateObject("Word.Application")
Set objDoc = objWord.Documents.Open("C:\Users\Ethan\Downloads\POS\POS-master\app\models\operations\inventory\output.docx")

objDoc.PrintOut()
objWord.Quit