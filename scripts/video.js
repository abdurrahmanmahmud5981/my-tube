// load categories
const loadCatagories = () => {
  //fetch data
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCatagories(data.categories))
    .catch((err) => console.log(err));
};

const loadCategoryVideo = (id) => {
  //fetch data
  fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      //remove active class 
      removeActiveClass()

      //add active calass
      const activeBtn = document.getElementById(`btn-${id}`);
      activeBtn.classList.add("active")
      displayVideos(data.category);
    })
    .catch((err) => console.log(err));
};

const removeActiveClass =()=>{
  const buttons = document.getElementsByClassName("category-btn")
  for (const btn  of buttons) {
    btn.classList.remove("active")
  }
}
//create display categories
function displayCatagories(categories) {
  //add data in html
  const categoryContainer = document.getElementById("categories");
  categories.forEach((item) => {
    // create a button
    const buttonContainer = document.createElement("div");
    buttonContainer.innerHTML = `
    <button id="btn-${item.category_id}" onclick="loadCategoryVideo(${item.category_id})" class ="btn category-btn">
    ${item.category}
    </button>`;

    //add btn to category container
    categoryContainer.appendChild(buttonContainer);
  });
}

//load videos

const loadVideos = (searchText="") => {
  //fetch data
  fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then((res) => res.json())
    .then((data) => displayVideos(data.videos))
    .catch((err) => console.log(err));
};

const getTimeString = (time) => {
  let week = parseInt(time / 86400);
  let day = parseInt(time / 86400);
  let hour = parseInt(time / 3600);
  let remainingSecound = time % 3600;
  let minute = parseInt(time / 60);
  day = day % 24;
  hour = hour % 60;
  minute = minute % 60;
  remainingSecound = remainingSecound % 60;

  return `${day} day ${hour} hour ${minute} minute ${remainingSecound}`;
};

const loadDetails = async (videoId)=>{
  const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`
  const res = await fetch(url);
  const data = await res.json()
  displayDetails(data.video);
}
const displayDetails = (video)=>{
  const detailContainer = document.getElementById("modal-content")

  detailContainer.innerHTML = `
      <img
      class="h-full w-full object-cover"
        src=${video.thumbnail}
        alt=${video.title} />
        <p>${video.description}</p>
  `

  // way 1
  // document.getElementById("showModalDetail").click()
   // way 2
   document.getElementById("customeModal").showModal();
}
const displayVideos = (videos) => {
  //add data in html
  const videoContainer = document.getElementById("videos");
  videoContainer.innerHTML = "";
  if (videos.length === 0) {
    videoContainer.classList.remove("grid");
    videoContainer.innerHTML = `
    <div class="min-h-[300px] flex flex-col gap-5 justify-center items-center">
     <img src="assets/Icon.png" alt="icon" />
     <h2 class=" text-center text-xl font-bold">No Content Found in Category</h2>
    </div>
    `;
  } else {
    videoContainer.classList.add("grid");
   
  }
  videos.forEach((video) => {
    // create a card
    const card = document.createElement("div");
    card.classList = "card card-compact ";
    card.innerHTML = `
          <figure class="h-[200px] relative">
      <img
      class="h-full w-full object-cover"
        src=${video.thumbnail}
        alt=${video.title} />
        ${
          video.others.posted_date?.length === 0
            ? ""
            : `<span class=" absolute right-2 bottom-2 bg-black p-1 rounded text-white">${getTimeString(
                video.others.posted_date
              )}</span>`
        }
       
    </figure>
    <div class=" px-0 py-2 flex gap-2 ">
       <div>
         <img class = " w-10 h-10 rounded-full object-cover" src=${
           video.authors[0].profile_picture
         } alt="" />
       </div>
       <div>
            <h2 class= "font-bold">${video.title}</h2>
       <div class="flex items-center gap-2">
           <p class=" text-gray-400">${video.authors[0].profile_name}</p>
           ${
             video.authors[0].verified
               ? `<img class=" w-5" src=${"https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png"} alt="" />`
               : ""
           }
       </div>
       <p>
       <button onclick="loadDetails('${video.video_id}')" class=" btn btn-error btn-sm">Details</button>
       </p>
  
       </div>
      </div>
    
    
          
          `;

    // //add btn to category container
    videoContainer.appendChild(card);
  });
};

document.getElementById("search-input").addEventListener("keyup",(e)=>{
  // e.key ==='Enter' ? e.target.value = '':""
  // console.log(e);
  loadVideos(e.target.value);
})
loadCatagories();
loadVideos();
