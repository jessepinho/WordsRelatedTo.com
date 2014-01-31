class RelatedWordsController < ApplicationController
  before_action :set_word, only: [:create, :new]
  before_action :set_related_word, only: [:create]

  def create
    @word.related_words << @related_word
    respond_to do |format|
      format.html { redirect_to @word }
    end
  end

  def new
  end

  private
    def set_word
      @word = Word.find(params[:id])
    end

    def set_related_word
      @related_word = Word.find_or_create_by word: params[:word]
    end
end
