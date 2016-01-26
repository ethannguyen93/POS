Set objWord = CreateObject("Word.Application")
Set objDoc = objWord.Documents.Open("C:\POS1\app\models\operations\inventory\output.docx")

objDoc.PrintOut()
objWord.Quit