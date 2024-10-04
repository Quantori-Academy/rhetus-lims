import { http, HttpResponse } from 'msw';
import { api } from './api-url.js';

const locations = [
    {
        id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b4t5y5y5y',
        room: 'Building 1, Room 12',
        name: 'Cabinet 1, shelf 3'
    },
    {
        id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b93f5g6d6d4g6g',
        room: 'Building 2, Room 23',
        name: 'Cabinet 2, shelf 4'
    },
]

export const storageLocationHandlers = [
    http.get(api('/storages'), () => {
        return HttpResponse.json(locations)
    }),
    http.get(api('/storages/:id'), (req) => {
        const { id } = req.params;
        const storage = locations.find(location => location.id === id);
        console.log("storage", storage)
        if(!storage) {
            return HttpResponse.json(
                {message: 'Storage location is not found'},
                { status: 404 }
            )
        }
        return HttpResponse.json(storage);
    })
]