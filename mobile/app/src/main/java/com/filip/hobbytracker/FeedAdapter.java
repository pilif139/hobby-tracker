package com.filip.hobbytracker;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.filip.hobbytracker.api.generated.model.GetFeed200ResponseSessionsInner;

import java.util.ArrayList;
import java.util.List;

public class FeedAdapter extends RecyclerView.Adapter<FeedAdapter.ViewHolder> {

    private final List<GetFeed200ResponseSessionsInner> sessions = new ArrayList<>();

    public void clearSessions() {
        sessions.clear();
        notifyDataSetChanged();
    }

    public void addSessions(List<GetFeed200ResponseSessionsInner> newSessions) {
        int startPosition = sessions.size();
        sessions.addAll(newSessions);
        notifyItemRangeInserted(startPosition, newSessions.size());
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_feed_session, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        GetFeed200ResponseSessionsInner session = sessions.get(position);
        holder.tvUserName.setText(session.getUser().getName());
        holder.tvHobbyName.setText(session.getHobby().getName());
        holder.tvNotes.setText(session.getNotes());
    }

    @Override
    public int getItemCount() {
        return sessions.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvUserName, tvHobbyName, tvNotes;

        ViewHolder(View itemView) {
            super(itemView);
            tvUserName = itemView.findViewById(R.id.tvUserName);
            tvHobbyName = itemView.findViewById(R.id.tvHobbyName);
            tvNotes = itemView.findViewById(R.id.tvNotes);
        }
    }
}
