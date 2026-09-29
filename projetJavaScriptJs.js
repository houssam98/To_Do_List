 function DeplacerBottleResponsive(){

        let parentPosition = document.querySelector(".input-add");

        let progressBottle=document.querySelector(".progress-bottle");

        if (window.innerWidth < 768){
            parentPosition.append(progressBottle);
        }else{

            let to_do_list_main_container=document.querySelector(".to-do-list-project-container");
            to_do_list_main_container.insertBefore(progressBottle,to_do_list_main_container.firstChild)            
        }
    }
    DeplacerBottleResponsive();
    let previousWidth = window.innerWidth ;
    window.addEventListener("resize",()=>{
        if(window.innerWidth != previousWidth){
            DeplacerBottleResponsive();
            renderTask();
            previousWidth=window.innerWidth;
        }
    });


    

    let inputButton=document.querySelector(".task-input");
    let addBoutton=document.querySelector(".add-task");
    let filterButtons=document.querySelectorAll(".filter");
    let TasksList=document.querySelector(".tasks-container");
    let analyticsTasks=document.querySelector(".analytics-tasks");
    let tasks=[];

    addBoutton.addEventListener("click",ajouterTache);
    inputButton.addEventListener("keydown",function(e){
        if(e.key == "Enter"){
            ajouterTache();
        }
    })

    function ajouterTache(){
        let text = inputButton.value;
        let regex=/^[\s]+$/;
        if(text =='' || regex.test(text)){
            return;
        }else{
            tasks.push({text : `${text}`,Done : false});
            inputButton.value='';
            renderTask();
        }
    }

    filterButtons.forEach(button=>{
        button.addEventListener("click",function(){
            document.querySelector(".filter.selected").classList.remove("selected");
            button.classList.toggle("selected");
            renderTask();
        });
    })

    function renderTask(){

        TasksList.textContent = '';

        let filter = document.querySelector(".filter.selected").dataset.filter;
        
        let filteredTasks=[];
        
        if(filter == "active"){
            filteredTasks=tasks.filter(task=>{
                return task.Done ===  false;
            })
        }else{
            if(filter == "done"){
                filteredTasks=tasks.filter(task=>{
                    return task.Done == true;
                })
            }else{
                filteredTasks=tasks.filter(task=>{
                    return true;
                })
            }
        }

        filteredTasks.forEach((task)=>{
            let li = document.createElement("li");
            let span = document.createElement("span");

            span.textContent = task.text;
            span.style.marginRight="5em";

            if(task.Done){
                li.classList.add("Done");
            }

            let delButton=document.createElement("button");
            delButton.innerText='🗑';
            delButton.classList.add("del-btn");
            delButton.addEventListener("click",function (){
                let index = tasks.findIndex(t=> t === task);
                if(index != -1){
                    tasks.splice(index,1);
                }
                renderTask();
            });


            span.addEventListener("dblclick",function(e){
                editTask(e.currentTarget,task);
            });

            let checkButton = document.createElement("input");
            checkButton.type="checkbox";
            checkButton.checked=task.Done;
            checkButton.classList.add("check-btn");
            checkButton.style.marginRight="7px";
            checkButton.addEventListener("change",()=>{
                task.Done = !task.Done;
                renderTask();
            });
            
            span.prepend(checkButton)
            li.append(span,delButton);
            TasksList.appendChild(li);
        })
        taskCounter();
    }

    function taskCounter(){
        let completedTasks=tasks.reduce((doneTasks,task)=>{
            if(task.Done == true)
                return doneTasks+1;
            return doneTasks;
            
            }
        ,0);
        let pendingTasks=tasks.reduce((pendingTasks,task)=>{
            if(task.Done == false)
                return pendingTasks+1;
            return pendingTasks;
        },0);

        let allTasks = pendingTasks+completedTasks;

        progressBottle(completedTasks);
        if(window.innerWidth< 768){
            analyticsTasks.innerHTML  = `Total : ${allTasks}<br><hr>Pending : ${pendingTasks}<br><hr>Completed : ${completedTasks} `;
        }else{
        analyticsTasks.textContent = `Total : ${allTasks} | Pending : ${pendingTasks} | Completed : ${completedTasks} `;
        }

    }

    function progressBottle(completedTasks){

        let liquid = document.querySelector(".liquid");
        let allTasks = tasks.length;
        let sizePerTask;
        let currentSizeBottle;

        if (window.innerWidth < 768) {
            let widthPercent = allTasks === 0 ? 0 : (completedTasks / allTasks) * 100;
            liquid.style.width = widthPercent + '%';
            if(liquid.style.width == "100%"){
                congrats();
            }
            liquid.style.height = "100%";

        }else{
            sizePerTask =allTasks === 0?0: 150/allTasks;
            currentSizeBottle=sizePerTask*completedTasks;
            liquid.style.height = `${currentSizeBottle}px`;
            liquid.style.width="100%";
            if(currentSizeBottle===150){
                congrats();
            }

        }
    }

    function editTask(TaskParent,task){
        let parent = TaskParent;
        let input = document.createElement("input");
        input.type="text";

        let text = task.text;
        input.value=text;

        parent.replaceChild(input,parent.lastChild);

        input.addEventListener("keypress",function(e){
            if(e.key =="Enter"){
                task.text=input.value;
                renderTask();
            }
        })

    }

    

    function congrats(){

        const quotes = [
        "Life begins at the end of your comfort zone.",
        "He who moves a mountain begins by carrying away small stones. – Confucius",
        ];

        let congratsDiv = document.createElement("div");
        congratsDiv.setAttribute("class","congratsDiv");
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        let felicitationParagraphe = document.createElement("p");
        felicitationParagraphe.textContent="Congratulations you have finished all your tasks 🎉";
        felicitationParagraphe.setAttribute("class","congratsPara");

        let quoteParagraphe=document.createElement("p");
        quoteParagraphe.textContent=randomQuote;
        quoteParagraphe.setAttribute("class","quotePara");

        congratsDiv.append(felicitationParagraphe,quoteParagraphe);
        document.body.append(congratsDiv);
        tasks=[];
        
        setTimeout(()=>{
                document.body.removeChild(congratsDiv);
                renderTask();
        },5000)


    }


    renderTask();

