module.exports.secondState = async (event) => {
    console.log(event);
    const {
      value,
    } = event;
  
    const result = 20 + value;
    return {
      value: result,
      status: 'SUCCESS'
    };
  };