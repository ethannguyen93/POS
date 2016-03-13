Set objWord = CreateObject("Word.Application")
Set objDoc = objWord.Documents.Open("C:\POS1\app\models\operations\inventory\outputCustomer.docx")

objDoc.PrintOut()
objWord.Quit

Set objWord = CreateObject("Word.Application")
Set objDoc = objWord.Documents.Open("C:\POS1\app\models\operations\inventory\outputMerchant.docx")

objDoc.PrintOut()
objWord.Quit
