const dropZone = document.querySelector(".drop-zone")
const browseBtn = document.querySelector(".browseBtn")
const fileInput = document.querySelector("#fileInput");

const bgProgress = document.querySelector(".bg-progress");
const progressContainer = document.querySelector(".progress-container");
const progressBar = document.querySelector(".progress-bar");

const percentDiv = document.querySelector("#percent");

const host = "https://fs-2-mqto.onrender.com/";
const uploadURL = `${host}api/files`;
// const uploadURL = `${host}api/files`;

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

const uploadFile = ()=>{
    progressContainer.style.display ="block";

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("myfile",file);

    const xhr = new XMLHttpRequest();   
    xhr.onreadystatechange = ()=>{
        if(xhr.readyState === XMLHttpRequest.DONE)
        {
            console.log(xhr.response);
            showLink(JSON.parse(xhr.response))
        }
    };

    xhr.upload.onprogress = updateProgress;

    xhr.open("POST", uploadURL);
    xhr.send(formData);
};

const updateProgress = (e)=>{
        const percent = Math.round((e.loaded / e.total) * 100);
        // console.log(percent);
        bgProgress.style.width = `${percent}%`;
        percentDiv.innerText = percent;
        progressBar.style.tranform = `scaleX(${percent/100})`
}

const showLink = ({file}) =>{

    console.log(file);
    progressContainer.style.display = "none";
}