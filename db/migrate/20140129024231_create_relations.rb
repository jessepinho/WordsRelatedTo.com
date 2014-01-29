class CreateRelations < ActiveRecord::Migration
  def change
    create_table :relations do |t|
      t.integer :related_id
      t.integer :relating_id

      t.timestamps
    end
  end
end
