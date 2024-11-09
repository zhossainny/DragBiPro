export function buildCategoryList(apps){
    let categories = [];
    let appsWithCategory =
    apps.filter(app=> app.appType ==="EXCEL" || app.appType ==="WEBAPP")
    .filter(app=> app.tags !== null && app.tags["category"]);

    for(let app of appsWithCategory){
        const category = app.tags["category"];
        
        let categoryParts = category.split('\\');
        let parentCategory = categoryParts[0];
        let subCategory = categoryParts[1];

        let categoryIndex = categories.findIndex(cat=> cat.name===parentCategory);
        
        if(categoryIndex === -1){
            categories.push({
                name: parentCategory,
                subCategories : subCategory ?  [].concat(subCategory) : []
            });
        }
        else if(subCategory){
            categories[categoryIndex].subCategories.push(subCategory);
            categories[categoryIndex].subCategories = categories[categoryIndex].subCategories.sort((a,b)=>{
                if(a.toLowerCase() < b.toLowerCase()) return -1;
                if(a.toLowerCase() > b.toLowerCase()) return 1;
                return 0;
            });
        }

        categories = categories.sort((a,b)=> {
            if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            return 0;
        });
    }

    return categories;
}

