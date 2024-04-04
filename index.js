const dropZone = document.querySelector(".drop-zone")
const browseBtn = document.querySelector(".browseBtn")
const fileInput = document.querySelector("#fileInput");

const bgProgress = document.querySelector(".bg-progress");
const progressContainer = document.querySelector(".progress-container");
const progressBar = document.querySelector(".progress-bar");

const percentDiv = document.querySelector("#percent");
const fileURLInput = document.querySelector("#fileURL");
const sharingContainer = document.querySelector(".sharing-container");
const copyBtn = document.querySelector("#copyBtn");
const emailForm = document.querySelector("#emailForm")
const maxAllowedSize = 5 * 1024 * 1024;

const host = "https://fs-2-mqto.onrender.com/";
const uploadURL = `${host}api/files`;
const emailURL = `${host}api/files/send`;

dropZone.addEventListener("dragover", (e)=>{
    e.preventDefault();

    if(!dropZone.classList.contains("dragged"))
    {
        dropZone.classList.add("dragged");
    }
    
});

dropZone.addEventListener("dragleave", ()=>{
    dropZone.classList.remove("dragged");
});

dropZone.addEventListener("drop", (e)=>{
    e.preventDefault();
    const files = e.dataTransfer.files;
    dropZone.classList.remove("dragged");
    console.log(files);
    if(files.length){
        fileInput.files = files;
        uploadFile();
    }
    
});

fileInput.addEventListener("change", ()=>{
    uploadFile();
});

browseBtn.addEventListener("click", ()=>{
    fileInput.click();
});

copyBtn.addEventListener("click", ()=>{
    fileURLInput.select();
    document.execCommand("copy");
});

const uploadFile = ()=>{
    
    if(fileInput.files.length > 1)
    {
        resetFileInput();
        alert("You can only upload 1 file")
        return
    }

    const file = fileInput.files[0];
    if(file.size > maxAllowedSize)
    {
        alert("You can only upload max 5mb");
        resetFileInput();
        return;
    }


    progressContainer.style.display ="block";
    

    
    const formData = new FormData();
    formData.append("myfile",file);

    const xhr = new XMLHttpRequest();   
    xhr.onreadystatechange = ()=>{
        if(xhr.readyState === XMLHttpRequest.DONE)
        {
            console.log(xhr.response);
            onUploadSuccess(JSON.parse(xhr.response))
        }
    };

    xhr.upload.onprogress = updateProgress;

    xhr.open("POST", uploadURL);
    xhr.send(formData);
};

const resetFileInput = ()=>{
    fileInput.value = "";
}

const updateProgress = (e)=>{
        const percent = Math.round((e.loaded / e.total) * 100);
        // console.log(percent);
        bgProgress.style.width = `${percent}%`;
        percentDiv.innerText = percent;
        progressBar.style.tranform = `scaleX(${percent/100})`
}

const onUploadSuccess = ({file:url}) =>{

    console.log(url);
    fileInput.value = "";
    emailForm[2].removeAttribute("disabled");
    progressContainer.style.display = "none";
    sharingContainer.style.display ="block";
    fileURLInput.value = url;

};

emailForm.addEventListener("submit", (e)=>{
    e.preventDefault();

    const url = (fileURLInput.value);

    const formData = {
        uuid: url.split("/").splice(-1, 1)[0],
        emailTo: emailForm.elements["to-email"].value,
        emailFrom: emailForm.elements["from-email"].value
    }

    emailForm[2].setAttribute("disabled", "true");
    console.table(formData);

    

    fetch(emailURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    }).then(res => res.json()).
    then( (data) =>{
        if(data.success)
        {
            sharingContainer.style.display = "none";
        }
    });

    // fetch(emailURL, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(formData),
    //   })
    //     .then((res) => res.json())
    //     .then((data) => {
    //       if (data.success) {
    //         // showToast("Email Sent");
    //         sharingContainer.style.display = "none"; // hide the box
    //       }
    //     });
});

