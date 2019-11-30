const message = {
  general: {
    500: { status: 'error', message: 'Error Internal Server!' },
  },
  user: {
    401: { status: 'error', message: 'Unauthorized!' },
    405: { status: 'error', message: 'Please, Fill Another User Name And Password!' },
    406: { status: 'error', message: 'Please, Fill User Name And Password!' },

  },
  location: {
    401: { status: 'error', message: 'Please, provider lat and lng!' },
    402: { status: 'error', message: 'Please, provider a status for change!' },
  }
}

module.exports = message;