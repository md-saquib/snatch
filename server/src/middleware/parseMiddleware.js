

export const parseStringIntoNumberDuringApiCall = (req, res, next) => {
    const { sizes, price } = req.body
    if (sizes) req.body.sizes = JSON.parse(req.body.sizes)
    if (price) req.body.price = JSON.parse(req.body.price)
    next()
} 