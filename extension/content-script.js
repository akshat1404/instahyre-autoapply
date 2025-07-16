function autoApply() { 
    const applyButton = document.querySelector('.btn.btn-lg.btn-primary.new-btn');
    
    if (applyButton) {
        const companyName = document.querySelector('.company-name.ng-binding')?.innerText || 'Unknown Company';
        console.log(`Applying to ${companyName}`);
        applyButton.click();
    }
}

const observer = new MutationObserver((mutations) => {
    
    autoApply();
});

function startObserver(){

    let id=setInterval(() => {
    
        const elementToBeObserved=document.querySelector('.row.bar-actions.ng-scope');
    
        if(elementToBeObserved) {
            observer.observe(elementToBeObserved, {
                childList: true,
                subtree: true
            });
            autoApply()
            clearInterval(id);
        }
    
    }, 5000); 
}

function initialInterval(){

    let id=setInterval(() => {
        const element=document.querySelector('#interested-btn');
        if(element){
            clearInterval(id);
            element.click();
            startObserver();
        }
    },1000); 
}

initialInterval();