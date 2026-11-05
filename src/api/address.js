import instance from '@/utils/request'

export const getAddressList = () => {
  return instance.get('/address/list')
}

export const addAddress = (name, phone, region, detail) => {
  return instance.post('/address/add', {
    form: {
      name, phone, region, detail
    }
  })
}

export const getRegionTree = () => instance.get('/region/tree')

// 預設地址的 id，回 data.defaultId，對應列表每筆的 address_id
export const getDefaultId = () => instance.get('/address/defaultId')

// 地址詳情，回 data.detail：name、phone、detail、province_id、city_id、region_id、region{province,city,region}
export const getAddressDetail = (addressId) => instance.get('/address/detail', {
  params: { addressId }
})

export const editAddress = (addressId, name, phone, region, detail) => {
  return instance.post('/address/edit', {
    addressId,
    form: { name, phone, region, detail }
  })
}

// 刪除地址，參數是要刪的 address_id
export const removeAddress = (addressId) => instance.post('/address/remove', {
  addressId
})
