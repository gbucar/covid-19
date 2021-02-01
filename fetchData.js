fetch("https://api.sledilnik.org/api/stats")
    .then(a=>a.json())
    .then(data=>{
        let tooltip = d3.select("body").append("div").attr("id", "tooltip").attr("style", "opacity: 0;")
        let padding = 100
        let w = window.innerWidth-padding
        let h = window.innerHeight-padding
        data.pop()
        let average = data.map((a,i,d)=>[Math.floor((d.slice(i-6>0?i-6:0,i+1).reduce((b,a)=>(a.cases.confirmedToday?a.cases.confirmedToday:0) + b,0)/7)), new Date(a.year, a.month-1, a.day)])
        let dif = (average[average.length-1][0]-average[average.length-8][0])/average[average.length-1][0]
        let a = average[average.length-1][0]
        let date = average[average.length-1][1]

        while(a>600&&a<2000){
            a+=dif*a
            average.push([a,date.setDate(date.getDate()+1)])
        }
        console.log(average)
        let info = d3.select("body")
            .append("div")  
            .attr("id", "info")
        info.append("h2")
            .attr("id","title")
            .text(date.toDateString())
        let xScale = d3.scaleLinear()
            .domain([d3.min(average, d=>d[1]), d3.max(average, d=>d[1])])
            .range([0, w-padding])
        let yScale = d3.scaleLinear()
            .domain([0, d3.max(average, d=>d[0])])
            .range([h-padding,0])
        let svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
        let yAxis = d3.axisLeft(yScale)
        let xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%B %Y"))
        svg.selectAll("rect")
            .data(average)
            .enter()
            .append("rect")
            .attr("x", (d,i)=>i*(w-padding)/average.length+padding)
            .attr("y", d=>h+yScale(d[0])-yScale(0)-padding)
            .attr("width", (d,i)=>(w-padding)/average.length)
            .attr("height", d=>-yScale(d[0])+yScale(0))
            .on("mouseover", a=>{
                let pos = d3.event
                tooltip.attr("style", `opacity: 1; top: ${pos.pageY+20}px; left: ${pos.pageX}px;`)
                    .text(`${Math.floor(a[0])}\n${new Date(a[1]).toDateString()}`)
            })
            .on("mousemove", (a,b,c)=>{
                let pos = d3.event
                tooltip.attr("style", `opacity: 1; top: ${pos.pageY+20}px; left: ${pos.pageX}px;`)
                    .text(`${Math.floor(a[0])}\n${new(a[1]).toDateString()}`)
            })
            .on("mouseout", a=>{
                tooltip.attr("style", "opacity: 0;")
                    .text("")
            })
        svg.append("g")
            .attr("transform", `translate(${padding}, ${0})`)
            .call(yAxis)
        svg.append("g")
            .attr("transform", `translate(${padding}, ${h-padding})`)
            .call(xAxis)
    })