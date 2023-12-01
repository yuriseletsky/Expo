const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImN1c19PUnFMOG1pYzNOejg1bCIsIm1vZXNpZlByaWNpbmdJZCI6InByaWNlXzFNUXF5dkJESWxQbVVQcE1NNWc2RmVvbyIsImlhdCI6MTY5MjAwMzczN30.Jj8o_3ZHHPEGDjO9IO2_F_GdVxj3V5GCUdnwtbrGqzk'
    }
};

(async () => {

    await fetch('https://api.techspecs.io/v4/all/brands?category=Smartphones', options)
        .then(response => response.json())
        .then(response => {
            response.data.items.forEach(item => {
                
                (async ()=>{
                    const optionsOne = {
                        method: 'POST',
                        headers: {
                          accept: 'application/json',
                          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImN1c19PUnFMOG1pYzNOejg1bCIsIm1vZXNpZlByaWNpbmdJZCI6InByaWNlXzFNUXF5dkJESWxQbVVQcE1NNWc2RmVvbyIsImlhdCI6MTY5MjAwMzczN30.Jj8o_3ZHHPEGDjO9IO2_F_GdVxj3V5GCUdnwtbrGqzk'

                        },
                        body: JSON.stringify({category: ['Smartphones'], brand: [item.brand]})
                      };
                    await fetch('https://api.techspecs.io/v4/all/products?page=0', optionsOne)
                    .then(response => response.json())
                    .then(response => {
                        
                    })
                })()
                .catch(err => console.error(err));
            });
        })
        .catch(err => console.error(err));

    await fetch('https://api.techspecs.io/v4/all/brands?category=Tablets', options)
        .then(response => response.json())
        .then(response => {
            console.log(response)
        })
        .catch(err => console.error(err));

    await fetch('https://api.techspecs.io/v4/all/brands?category=Laptops', options)
        .then(response => response.json())
        .then(response => {
            console.log(response)
        })
        .catch(err => console.error(err));
})()