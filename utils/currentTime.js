const currentTime = async (date,minutes) => {
    return (date.getTime() + minutes*60000);
  };

  export default currentTime