fetch("https://api.sledilnik.org/api/stats")
    .then(a=>a.json())
    .then(data=>{
        let w = 1500
        let h = 800
        data.pop()
        let average = data.map((a,i,d)=>Math.floor((d.slice(i-6>0?i-6:0,i+1).reduce((b,a)=>(a.cases.confirmedToday?a.cases.confirmedToday:0) + b,0)/7)))
        let dif = average[average.length-1]-average[average.length-8]
        let a = average[average.length-1]
        let date = new Date()
        while(a>600&&a<2000){
            a+=dif/7
            average.push(a)
            let day = date.getDate()
            day += 1
            date.setDate(day)
        }
        console.log(date)
        let xScale = d3.scaleLinear()
        let yScale = d3.scaleLinear()
            .domain([0,d3.max(average)])
            .range([0, h])
        let svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
        
        let yAxis = d3.axisLeft(yScale)
        let xAxis = d3.axisBottom(xScale)
            
        svg.selectAll("rect")
            .data(average)
            .enter()
            .append("rect")
            .attr("x", (d, i)=>i*w/average.length)
            .attr("y", (d, i)=>h-yScale(d))
            .attr("height", (d)=>yScale(d))
            .attr("width", w/average.length)
    })