export function addCategoryToApp(apps){
    return apps.map(app=> {
        if(app.tags["category"]){
            let categoryParts = app.tags["category"].split('\\');
            let category = categoryParts[0];
            let subcategory = categoryParts[1];

            return Object.assign({ category: category, subcategory : subcategory}, app);
        }
        else{
            return Object.assign({ category: "", subcategory : ""}, app);
        }
    });
}