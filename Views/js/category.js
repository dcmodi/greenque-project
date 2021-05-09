
let categoryForm = document.querySelector('#categoryForm')

let categorName = document.getElementsByClassName('categoryName')
let nameArr = []

for (var i = 0; i < categorName.length; i++) {
    nameArr.push(categorName[i].innerText)
}


var categoryFormValidation = () => {
    let nameValue = document.getElementById('categoryValue').value

    if (nameValue == "") {
        var str = "All Fields Are Required.";
        document.querySelector('.nameErr').innerHTML = str

        //alert(document.getElementsByClassName('nameErr').innerHTML)
        return false
    }
    else {
        if (updateName != document.getElementById('categoryValue').value) {
            if (nameArr.indexOf(nameValue) == 0) {
                document.querySelector('.nameErr').innerHTML = "Category with same name exists"
                return false
            }
            else{
                if(updateName==""){
                    categoryForm.method = "POST"
                    categoryForm.action = "/admin/managecategory"
                }
                else{
                    categoryForm.method = "POST"
                    categoryForm.action = "/admin/managecategory/" + id 
                }
                return true
            }
                
        }
        else {
            return false
            document.getElementById('categoryValue').value = ""
            categoryForm.style.display = "none";    
        }
    }

    return true
}

var displayForm = () => {
    document.getElementById('categoryValue').value = ""
    updateName = "",id=""
    if (categoryForm.style.display === "" || categoryForm.style.display === "none") {
        categoryForm.style.display = "flex";
    }
    else {
        categoryForm.style.display = "none";
    }
}

var updateName = "",id=""
var updateCategory = (category) => {
    displayForm()
    categoryForm.style.display = "flex";
    updateName = category.parentElement.parentElement.children[1].innerText
    id = category.parentElement.parentElement.children[0].value
    document.getElementById('categoryValue').value = updateName
    console.log(document.getElementById('categoryValue').value)
}
//console.log(nameArr)