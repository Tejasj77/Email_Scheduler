
exports.emailScheduler = (req,res)=>{
  let data = EmailID.find({},(err,data)=>{
    if(err){
        console.log(err);
    }else{
        let date = new Date();
        let today = {
            today_date:date.getDate(),
            today_month:date.getMonth()+1,
            today_Hour:date.getHours(),
            today_Minute:date.getMinutes()
        }
        let check_string = `${today["today_Hour"]} ${today["today_Minute"]} ${today["today_date"]} ${today["today_month"]}`
        console.log(check_string)
        query = {timeToSend:check_string}
        var arr_data = {};
        EmailID.find({},(err,data)=>{
            if(err){
                console.log(err);
            }else{
                for(var key in data){
                    arr_data[data[key]['timeToSend']] = data[key]   
                }

                for(var time in arr_data){ 
                    if(arr_data[check_string]){
                        sendEmail(arr_data[time]);
                    }
                }
            }
        })
        next();
}
  });
}
