namespace Capacity {
    namespace Category {
        type DTO = {
            id: string;
            name: string;
            image: Nullable<string>;
        };
    }
}

type Category = Capacity.Category.DTO;
