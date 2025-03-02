// Simple function to validate Netlify Identity is working
exports.handler = async (event, context) => {
    // Log the identity context in a real application
    console.log('Identity function called');
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: "Identity service is working",
        identity: context.clientContext?.identity || null
      })
    };
  };