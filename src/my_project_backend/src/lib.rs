use candid::{CandidType, Deserialize};
use std::cell::RefCell;
use std::collections::HashMap;

#[derive(CandidType, Deserialize, Clone)]
struct Item {
    id: u64,
    name: String,
}

thread_local! {
    static ITEMS: RefCell<HashMap<u64, Item>> = RefCell::new(HashMap::new());
    static NEXT_ID: RefCell<u64> = RefCell::new(0);
}

#[ic_cdk::update]
fn create_item(name: String) -> Item {
    NEXT_ID.with(|next_id| {
        let mut id = next_id.borrow_mut();
        let item = Item { id: *id, name };
        ITEMS.with(|items| items.borrow_mut().insert(*id, item.clone()));
        *id += 1;
        item
    })
}

#[ic_cdk::query]
fn read_items() -> Vec<Item> {
    ITEMS.with(|items| items.borrow().values().cloned().collect())
}

#[ic_cdk::update]
fn update_item(id: u64, name: String) -> Option<Item> {
    ITEMS.with(|items| {
        let mut items = items.borrow_mut();
        if let Some(item) = items.get_mut(&id) {
            item.name = name;
            Some(item.clone())
        } else {
            None
        }
    })
}

#[ic_cdk::update]
fn delete_item(id: u64) -> bool {
    ITEMS.with(|items| items.borrow_mut().remove(&id).is_some())
}